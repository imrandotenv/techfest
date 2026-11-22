import {
  Department,
  FacultyMember,
  EngineeringLabInfo,
  BusRoute,
  EmergencyContact,
  CampusZone,
} from '@/types';

export type CampusTab = 
  | '3d-map' 
  | 'directory'
  | 'overview' 
  | 'departments' 
  | 'faculty' 
  | 'labs' 
  | 'buses' 
  | 'contacts'
  | 'emergency';

export interface CampusZoneExtended extends CampusZone {
  slug: string;
  category: 'academic' | 'administrative' | 'residential' | 'transit' | 'recreational';
  operatingHours?: string;
  floorsDetail?: {
    floor: string;
    facilities: string[];
  }[];
  colorHex?: string;
}

export interface UniversalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: 'Department' | 'Faculty' | 'Engineering Lab' | 'Bus Stop' | 'Emergency SOS' | 'Campus Zone';
  badge: string;
  targetTab: CampusTab;
  actionPayload?: string;
}
