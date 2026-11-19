import {
  Department,
  FacultyMember,
  HostelInfo,
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
  | 'hostels' 
  | 'buses' 
  | 'hostel-bus'
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
  category: 'Department' | 'Faculty' | 'Hostel' | 'Bus Stop' | 'Emergency SOS' | 'Campus Zone';
  badge: string;
  targetTab: CampusTab;
  actionPayload?: string;
}
