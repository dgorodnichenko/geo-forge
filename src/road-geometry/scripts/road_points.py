import math
import osmnx as ox
import networkx as nx
import sys
import json 

def get_road_points(start_coords, end_coords, use_osm=True):
    if use_osm:
        try:
            center_lat = (start_coords[0] + end_coords[0]) / 2
            center_lng = (start_coords[1] + end_coords[1]) / 2
            
            dist = calculate_distance(start_coords, end_coords)
            search_radius = dist * 1.5
            
            G = ox.graph_from_point((center_lat, center_lng), 
                                  dist=search_radius, 
                                  network_type='drive')
            
            start_node = ox.nearest_nodes(G, start_coords[1], start_coords[0])
            end_node = ox.nearest_nodes(G, end_coords[1], end_coords[0])
            
            try:
                route = nx.shortest_path(G, start_node, end_node, weight='length')
                
                points = []
                for node in route:
                    points.append((G.nodes[node]['y'], G.nodes[node]['x']))
                
                return interpolate_points(points)
                
            except nx.NetworkXNoPath:
                print("No path found between points", file=sys.stderr)
                return None
                
        except Exception as e:
            print(f"Error accessing OpenStreetMap data: {str(e)}", file=sys.stderr)
            print(f"Start coords: {start_coords}", file=sys.stderr)
            print(f"End coords: {end_coords}", file=sys.stderr)
            return None
    else:
        pass

def interpolate_points(points, interval=10):
    if not points or len(points) < 2:
        return points
        
    interpolated = []
    
    for i in range(len(points) - 1):
        point1 = points[i]
        point2 = points[i + 1]
        
        dist = calculate_distance(point1, point2)
        
        num_points = max(1, int(dist / interval))
        
        for j in range(num_points):
            f = j / num_points
            lat = point1[0] + (point2[0] - point1[0]) * f
            lng = point1[1] + (point2[1] - point1[1]) * f
            interpolated.append((lat, lng))
    
    interpolated.append(points[-1])
    return interpolated

def calculate_distance(point1, point2):
    R = 6371000
    lat1, lon1 = math.radians(point1[0]), math.radians(point1[1])
    lat2, lon2 = math.radians(point2[0]), math.radians(point2[1])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c


if __name__ == "__main__":
    start = (float(sys.argv[1]), float(sys.argv[2]))
    end = (float(sys.argv[3]), float(sys.argv[4]))
    
    try:
        points = get_road_points(start, end)
        if points:
            print(json.dumps(points))
        else:
            print(json.dumps([]))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)