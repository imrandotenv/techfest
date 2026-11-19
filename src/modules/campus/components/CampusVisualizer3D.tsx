'use client';

import React, { useEffect, useRef, useState, useTransition } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Compass, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Building2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Info,
  Search,
  Sparkles,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { EXTENDED_CAMPUS_ZONES } from '../data';
import { CampusZoneExtended } from '../types';

interface CampusVisualizer3DProps {
  onSelectDepartment?: (deptCode: string) => void;
}

const MAIN_BUILDING_BRANCH_FLOORS: Record<
  'CSE' | 'ECE' | 'EE' | 'ME' | 'CE',
  { floor: string; level: number; facilities: string[]; labsCount: number }[]
> = {
  CSE: [
    {
      floor: 'Level 3 (Floor 3)',
      level: 3,
      facilities: [
        'CSE HOD Executive Office (Cabin 304)',
        'Algorithm & Data Structures Laboratory (Lab 301 • 60 Workstations)',
        'Object-Oriented Programming & Java Lab (Lab 302 • Dual Mon")',
        'Database Management & SQL Systems Center (Lab 303)',
      ],
      labsCount: 3,
    },
    {
      floor: 'Level 4 (Floor 4)',
      level: 4,
      facilities: [
        'AI & Machine Learning Research Hub (Lab 402 • RTX GPU Cluster)',
        'Cloud Server Infrastructure & Networking Rack (Room 404)',
        'Software Project Incubation Cell (Lab 405)',
        'Smart Interactive Classrooms 406–409',
      ],
      labsCount: 2,
    },
    {
      floor: 'Level 5 (Rooftop Shaded)',
      level: 5,
      facilities: [
        'High-Performance Computing Cluster (Lab 501)',
        'Annual TechFest Hackathon Co-Working Arena',
        'Robotics & Autonomous Vision Sandbox',
      ],
      labsCount: 2,
    },
  ],
  ECE: [
    {
      floor: 'Level 2 (Floor 2)',
      level: 2,
      facilities: [
        'ECE HOD Executive Cabin (Room 208)',
        'Embedded Systems & IoT Development Lab (Lab 201)',
        'VLSI & Microelectronics Chip Design Lab (Lab 202 • Cadence Suite)',
        'Digital Electronics & Logic Design Lab (Room 204)',
      ],
      labsCount: 3,
    },
    {
      floor: 'Level 3 (Floor 3)',
      level: 3,
      facilities: [
        'Analog & Digital Communication Lab (Room 307 • DSO Benches)',
        'Digital Signal Processing (DSP) & MATLAB Studio (Room 308)',
        'Faculty Consultation Cabins 211–216',
      ],
      labsCount: 2,
    },
    {
      floor: 'Level 5 (Rooftop Shaded)',
      level: 5,
      facilities: [
        'Microwave Engineering & Antenna Radiation Test Range',
        'Optical Fiber Communication & Optoelectronics Bay',
      ],
      labsCount: 2,
    },
  ],
  EE: [
    {
      floor: 'Ground Floor (Level 0)',
      level: 0,
      facilities: [
        'High Voltage Engineering & Arc Breakdown Lab (Lab G-01)',
        'Electrical Machines-I & II Heavy Motor Test Bay (Lab G-02)',
        'Power Systems Simulation & Load Flow Computing Lab (Lab G-05)',
      ],
      labsCount: 3,
    },
    {
      floor: 'Level 1 (Floor 1)',
      level: 1,
      facilities: [
        'Electrical Engg HOD Cabin (Room 112)',
        'Control Systems & Process Automation Lab (Room 105)',
        'Electrical Measurement & Sensor Instrumentation Lab (Room 107)',
        'Power Electronics & Electric Drives Laboratory (Room 109)',
      ],
      labsCount: 3,
    },
    {
      floor: 'Level 5 (Rooftop Shaded)',
      level: 5,
      facilities: [
        '50kW Grid-Connected Solar Photovoltaic Test Array',
        'Smart Microgrid Inverter & Battery Storage Station',
      ],
      labsCount: 2,
    },
  ],
  ME: [
    {
      floor: 'Ground Floor / Workshop Annex',
      level: 0,
      facilities: [
        'Central Mechanical Workshop & Machine Shop (Lathe, Shaper, Milling)',
        'CNC Machining & Turning Center (Room W-01)',
        'Foundry, Smithy & TIG/MIG Welding Bay (Room W-02)',
        'Fluid Mechanics & Hydraulic Turbo-Machinery Lab (Lab G-08)',
      ],
      labsCount: 4,
    },
    {
      floor: 'Level 1 (Floor 1)',
      level: 1,
      facilities: [
        'ME HOD Executive Office (Cabin 115)',
        'Heat Transfer & Applied Thermodynamics Lab (Room 116)',
        'Strength of Materials & Universal Testing Machine (UTM) Lab (Room 118)',
      ],
      labsCount: 2,
    },
    {
      floor: 'Level 2 (Floor 2)',
      level: 2,
      facilities: [
        'CAD/CAM & FEA Ansys Engineering Workstation Lab (Room 218)',
        'Kinematics & Dynamics of Machines Lab (Room 220)',
        'IC Engines & Multi-Cylinder Automobile Testing Bay (Lab G-10)',
      ],
      labsCount: 3,
    },
  ],
  CE: [
    {
      floor: 'Ground Floor (Level 0)',
      level: 0,
      facilities: [
        'Concrete Technology & Non-Destructive Testing Lab (Lab G-03)',
        'Soil Mechanics & Geotechnical Triaxial Lab (Lab G-04)',
        'Highway Materials & Transportation Engineering Lab (Lab G-06)',
        'Advanced Surveying, Total Station & GPS Equipment Vault (Room G-07)',
      ],
      labsCount: 4,
    },
    {
      floor: 'Level 1 (Floor 1)',
      level: 1,
      facilities: [
        'Civil Engineering HOD Cabin (Room 102)',
        'Structural Analysis & Deflection Mechanics Lab (Room 103)',
        'Environmental Engineering & Water Pollution Testing Lab (Room 104)',
      ],
      labsCount: 2,
    },
    {
      floor: 'Level 2 (Floor 2)',
      level: 2,
      facilities: [
        'Computer-Aided Structural Design Studio (AutoCAD & STAAD.Pro) (Room 205)',
        'GIS Mapping & Satellite Remote Sensing Cartography Lab (Room 207)',
      ],
      labsCount: 2,
    },
  ],
};

export function CampusVisualizer3D({ onSelectDepartment }: CampusVisualizer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedZone, setSelectedZone] = useState<CampusZoneExtended | null>(
    EXTENDED_CAMPUS_ZONES[0]
  );
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'CSE' | 'ECE' | 'EE' | 'ME' | 'CE'>('CSE');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cameraView, setCameraView] = useState<'iso' | 'front' | 'gate' | 'top'>('iso');
  const [, startTransition] = useTransition();

  // Three.js internal references for interaction
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());

  // Fly camera smoothly to a target
  const focusOnCoordinates = (coords: { x: number; y: number; z: number }) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    const targetPos = new THREE.Vector3(coords.x, 0, coords.z);
    const cameraOffset = new THREE.Vector3(coords.x + 24, coords.y + 18, coords.z + 28);

    // Smooth lerp animation
    const startCamPos = camera.position.clone();
    const startTarget = controls.target.clone();
    let progress = 0;

    const animateFocus = () => {
      progress += 0.05;
      if (progress < 1) {
        camera.position.lerpVectors(startCamPos, cameraOffset, progress);
        controls.target.lerpVectors(startTarget, targetPos, progress);
        controls.update();
        requestAnimationFrame(animateFocus);
      } else {
        camera.position.copy(cameraOffset);
        controls.target.copy(targetPos);
        controls.update();
      }
    };
    animateFocus();
  };

  const handleSelectZone = (zone: CampusZoneExtended) => {
    setSelectedZone(zone);
    focusOnCoordinates(zone.coordinates);
  };

  const setPresetView = (preset: 'iso' | 'front' | 'gate' | 'top') => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    setCameraView(preset);

    if (preset === 'iso') {
      camera.position.set(38, 35, 42);
      controls.target.set(0, 5, 0);
    } else if (preset === 'front') {
      camera.position.set(0, 18, 48);
      controls.target.set(0, 10, -5);
    } else if (preset === 'gate') {
      camera.position.set(0, 8, 55);
      controls.target.set(0, 4, 25);
    } else if (preset === 'top') {
      camera.position.set(0, 75, 0.1);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#FAF8F5'); // Soft architectural light warm canvas
    scene.fog = new THREE.FogExp2('#FAF8F5', 0.007);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(38, 35, 42);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.replaceChildren(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 12;
    controls.maxDistance = 120;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#FFFFFF', 1.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#E2D9CC', 1.2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight('#FFF3E0', 2.4);
    sun.position.set(-30, 55, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -65;
    sun.shadow.camera.right = 65;
    sun.shadow.camera.top = 65;
    sun.shadow.camera.bottom = -65;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 150;
    scene.add(sun);

    // Architectural Ground Plane
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#8BA07F', // manicured lawn green
      roughness: 0.95,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Materials
    const asphaltMat = new THREE.MeshStandardMaterial({ color: '#5C5F63', roughness: 0.9 });
    const walkwayMat = new THREE.MeshStandardMaterial({ color: '#E4DACD', roughness: 0.85 });
    const blueWallMat = new THREE.MeshStandardMaterial({ color: '#477FAD', roughness: 0.75 });
    const blueTrimMat = new THREE.MeshStandardMaterial({ color: '#285779', roughness: 0.8 });
    const stoneWallMat = new THREE.MeshStandardMaterial({ color: '#D8D0C3', roughness: 0.9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: '#89949A', metalness: 0.65, roughness: 0.35 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#74A7C9', metalness: 0.8, roughness: 0.1 });
    const whiteLineMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 });
    const burgundyMat = new THREE.MeshStandardMaterial({ color: '#702D3B', roughness: 0.8 });
    const libraryMat = new THREE.MeshStandardMaterial({ color: '#3E6B89', roughness: 0.8 });
    const workshopMat = new THREE.MeshStandardMaterial({ color: '#606C38', roughness: 0.85 });
    const pharmacyMat = new THREE.MeshStandardMaterial({ color: '#2A9D8F', roughness: 0.8 });

    // Road builder helper
    const addRoad = (x: number, z: number, w: number, d: number) => {
      const road = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), asphaltMat);
      road.position.set(x, -0.05, z);
      road.receiveShadow = true;
      scene.add(road);
    };

    const addWalkway = (x: number, z: number, w: number, d: number) => {
      const walk = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), walkwayMat);
      walk.position.set(x, -0.02, z);
      walk.receiveShadow = true;
      scene.add(walk);
    };

    // Roads layout
    addRoad(0, 5, 6, 95); // Main campus north-south artery
    addRoad(0, 0, 75, 5); // Central crossroad
    addRoad(0, 20, 65, 4); // Entrance junction road
    addRoad(-25, 20, 25, 4); // Parking access spur
    addWalkway(-13, 0, 2.5, 36);
    addWalkway(13, 0, 2.5, 36);
    addWalkway(0, -22, 28, 2);

    // Box structure helper
    const addBoxMesh = (
      group: THREE.Group,
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    const zoneGroups: THREE.Group[] = [];
    const meshesMap = new Map<string, THREE.Group>();

    // 1. MAIN COLLEGE BUILDING (Academic Core - U-Shaped, 6 Levels)
    const mainBuildingGroup = new THREE.Group();
    mainBuildingGroup.userData = { zoneId: 'zone-main', slug: 'main-building' };
    const bldHeight = 15; // 5 floors elevated + rooftop

    // Left Wing
    addBoxMesh(mainBuildingGroup, 8, bldHeight, 26, -12, bldHeight / 2, -3, blueWallMat);
    // Right Wing
    addBoxMesh(mainBuildingGroup, 8, bldHeight, 26, 12, bldHeight / 2, -3, blueWallMat);
    // Rear Connecting Wing
    addBoxMesh(mainBuildingGroup, 32, bldHeight, 8, 0, bldHeight / 2, -16, blueWallMat);

    // Floor architectural dividing strips
    for (let floor = 1; floor <= 4; floor++) {
      const y = floor * 3;
      addBoxMesh(mainBuildingGroup, 8.4, 0.2, 26.4, -12, y, -3, blueTrimMat);
      addBoxMesh(mainBuildingGroup, 8.4, 0.2, 26.4, 12, y, -3, blueTrimMat);
      addBoxMesh(mainBuildingGroup, 32.4, 0.2, 8.4, 0, y, -16, blueTrimMat);
    }

    // Windows pattern on wings
    for (let level = 0; level < 5; level++) {
      const y = 1.6 + level * 3;
      for (let z = -12; z <= 8; z += 3.5) {
        addBoxMesh(mainBuildingGroup, 0.15, 1.4, 2.2, -16.08, y, z, glassMat);
        addBoxMesh(mainBuildingGroup, 0.15, 1.4, 2.2, 16.08, y, z, glassMat);
      }
    }

    // Open corridor railings along inner courtyards
    for (let floor = 0; floor < 5; floor++) {
      const y = floor * 3 + 1.1;
      addBoxMesh(mainBuildingGroup, 0.12, 1.1, 23, -7.9, y, -3, metalMat);
      addBoxMesh(mainBuildingGroup, 0.12, 1.1, 23, 7.9, y, -3, metalMat);
    }

    // Metal-sheet sheltered rooftop
    const roofY = bldHeight + 0.3;
    addBoxMesh(mainBuildingGroup, 9, 0.25, 28, -12, roofY, -3, metalMat);
    addBoxMesh(mainBuildingGroup, 9, 0.25, 28, 12, roofY, -3, metalMat);
    addBoxMesh(mainBuildingGroup, 34, 0.25, 9.5, 0, roofY, -16, metalMat);

    // Rooftop posts
    for (const rx of [-15, -9, 9, 15]) {
      for (const rz of [-15, -4, 8]) {
        addBoxMesh(mainBuildingGroup, 0.2, 1.4, 0.2, rx, bldHeight + 1, rz, metalMat);
      }
    }

    scene.add(mainBuildingGroup);
    zoneGroups.push(mainBuildingGroup);
    meshesMap.set('zone-main', mainBuildingGroup);

    // 2. MAIN ENTRANCE BUILDING & PORTAL
    const entranceGroup = new THREE.Group();
    entranceGroup.userData = { zoneId: 'zone-entrance', slug: 'entrance-portal' };

    // Stone Portico structure
    addBoxMesh(entranceGroup, 8, 8, 5, -8, 4, 30, stoneWallMat);
    addBoxMesh(entranceGroup, 8, 8, 5, 8, 4, 30, stoneWallMat);
    addBoxMesh(entranceGroup, 24, 2.5, 5, 0, 9.25, 30, stoneWallMat); // Header beam over arch

    // Blue glass panels
    addBoxMesh(entranceGroup, 6, 5.5, 0.15, -8, 4.2, 32.6, glassMat);
    addBoxMesh(entranceGroup, 6, 5.5, 0.15, 8, 4.2, 32.6, glassMat);

    // Institutional Name Band
    addBoxMesh(entranceGroup, 14, 0.9, 0.2, 0, 7.5, 32.65, blueTrimMat);

    // Entry / Exit Gates
    for (const gx of [-4.5, 4.5]) {
      addBoxMesh(entranceGroup, 5.2, 0.15, 0.15, gx, 2.1, 33.5, metalMat);
      addBoxMesh(entranceGroup, 5.2, 0.15, 0.15, gx, 0.25, 33.5, metalMat);
      for (let bar = -2.2; bar <= 2.2; bar += 0.5) {
        addBoxMesh(entranceGroup, 0.1, 1.8, 0.1, gx + bar, 1.15, 33.5, metalMat);
      }
    }

    scene.add(entranceGroup);
    zoneGroups.push(entranceGroup);
    meshesMap.set('zone-entrance', entranceGroup);

    // 3. CENTRAL PARKING BAY
    const parkingGroup = new THREE.Group();
    parkingGroup.userData = { zoneId: 'zone-parking', slug: 'parking-transit' };
    addBoxMesh(parkingGroup, 26, 0.1, 18, -25, 0.02, 18, asphaltMat);

    // Stall line markings
    for (let px = -35; px <= -15; px += 3) {
      addBoxMesh(parkingGroup, 0.1, 0.02, 5.5, px, 0.08, 14, whiteLineMat);
      addBoxMesh(parkingGroup, 0.1, 0.02, 5.5, px, 0.08, 22, whiteLineMat);
    }
    // College Shuttle Bus Models (Simple architectural silhouettes)
    const busMat = new THREE.MeshStandardMaterial({ color: '#F4B400', roughness: 0.5 });
    addBoxMesh(parkingGroup, 2.8, 2.4, 7.5, -28, 1.25, 14, busMat);
    addBoxMesh(parkingGroup, 2.8, 2.4, 7.5, -23, 1.25, 14, busMat);

    scene.add(parkingGroup);
    zoneGroups.push(parkingGroup);
    meshesMap.set('zone-parking', parkingGroup);

    // 4. ARYABHATTA HALL OF RESIDENCE (Boys Hostel)
    const boysHostelGroup = new THREE.Group();
    boysHostelGroup.userData = { zoneId: 'zone-hostel-boys', slug: 'aryabhatta-hostel' };
    addBoxMesh(boysHostelGroup, 18, 9, 14, -28, 4.5, -15, burgundyMat);
    addBoxMesh(boysHostelGroup, 19, 0.35, 15, -28, 9.2, -15, stoneWallMat); // roof trim
    // Windows
    for (let row = 1; row <= 3; row++) {
      const wy = row * 2.5;
      for (let wx = -34; wx <= -22; wx += 2.8) {
        addBoxMesh(boysHostelGroup, 1.2, 1.3, 0.1, wx, wy, -7.9, glassMat);
      }
    }
    scene.add(boysHostelGroup);
    zoneGroups.push(boysHostelGroup);
    meshesMap.set('zone-hostel-boys', boysHostelGroup);

    // 5. KALPANA CHAWLA HALL OF RESIDENCE (Girls Hostel)
    const girlsHostelGroup = new THREE.Group();
    girlsHostelGroup.userData = { zoneId: 'zone-hostel-girls', slug: 'kalpana-chawla-hostel' };
    addBoxMesh(girlsHostelGroup, 18, 9, 14, 28, 4.5, -15, burgundyMat);
    addBoxMesh(girlsHostelGroup, 19, 0.35, 15, 28, 9.2, -15, stoneWallMat);
    for (let row = 1; row <= 3; row++) {
      const wy = row * 2.5;
      for (let wx = 22; wx <= 34; wx += 2.8) {
        addBoxMesh(girlsHostelGroup, 1.2, 1.3, 0.1, wx, wy, -7.9, glassMat);
      }
    }
    scene.add(girlsHostelGroup);
    zoneGroups.push(girlsHostelGroup);
    meshesMap.set('zone-hostel-girls', girlsHostelGroup);

    // 6. CENTRAL LIBRARY & AUDITORIUM COMPLEX
    const libraryGroup = new THREE.Group();
    libraryGroup.userData = { zoneId: 'zone-library', slug: 'central-library' };
    addBoxMesh(libraryGroup, 18, 8, 16, 26, 4, 10, libraryMat);
    addBoxMesh(libraryGroup, 12, 6, 0.15, 26, 4, 18.1, glassMat); // Glass atrium frontage
    addBoxMesh(libraryGroup, 19, 0.3, 17, 26, 8.15, 10, blueTrimMat);
    scene.add(libraryGroup);
    zoneGroups.push(libraryGroup);
    meshesMap.set('zone-library', libraryGroup);

    // 7. MECHANICAL WORKSHOP COMPLEX
    const workshopGroup = new THREE.Group();
    workshopGroup.userData = { zoneId: 'zone-workshops', slug: 'mechanical-workshops' };
    addBoxMesh(workshopGroup, 14, 6, 18, -28, 3, 2, workshopMat);
    // Industrial saw-tooth rooftop
    for (let r = -5; r <= 9; r += 4) {
      addBoxMesh(workshopGroup, 14.2, 1.2, 3.5, -28, 6.6, r, metalMat);
    }
    scene.add(workshopGroup);
    zoneGroups.push(workshopGroup);
    meshesMap.set('zone-workshops', workshopGroup);

    // 8. SANAKA INSTITUTE OF PHARMACY (West Block)
    const pharmacyGroup = new THREE.Group();
    pharmacyGroup.userData = { zoneId: 'zone-pharmacy', slug: 'pharmacy-block' };
    addBoxMesh(pharmacyGroup, 16, 10, 14, -16, 5, -34, pharmacyMat);
    addBoxMesh(pharmacyGroup, 17, 0.3, 15, -16, 10.15, -34, stoneWallMat);
    for (let r = 1; r <= 3; r++) {
      const wy = r * 2.8;
      for (let wx = -22; wx <= -10; wx += 3) {
        addBoxMesh(pharmacyGroup, 1.4, 1.4, 0.1, wx, wy, -26.9, glassMat);
      }
    }
    scene.add(pharmacyGroup);
    zoneGroups.push(pharmacyGroup);
    meshesMap.set('zone-pharmacy', pharmacyGroup);

    buildingMeshesRef.current = meshesMap;

    // Landscaping - Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#6A4B35', roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: '#3A633F', roughness: 0.95 });

    const createTree = (tx: number, tz: number, scale = 1) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.6 * scale, 8), trunkMat);
      trunk.position.set(tx, 0.8 * scale, tz);
      trunk.castShadow = true;
      scene.add(trunk);

      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 * scale, 1), leafMat);
      crown.position.set(tx, 2.2 * scale, tz);
      crown.castShadow = true;
      scene.add(crown);
    };

    const treeLocations = [
      [-38, -25], [-38, -15], [-38, -5], [-38, 5], [-38, 15], [-38, 25],
      [38, -25], [38, -15], [38, -5], [38, 5], [38, 15], [38, 25],
      [-20, 34], [-12, 34], [12, 34], [20, 34],
      [-10, 22], [10, 22], [-8, -2], [8, -2],
      [-5, -28], [5, -28], [0, -32]
    ];
    treeLocations.forEach(([tx, tz]) => createTree(tx, tz, 1.1));

    // Raycaster for building clicks & hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(zoneGroups, true);

      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && !rootGroup.userData.zoneId) {
          rootGroup = rootGroup.parent;
        }

        if (rootGroup && rootGroup.userData.zoneId) {
          const zoneId = rootGroup.userData.zoneId;
          const match = EXTENDED_CAMPUS_ZONES.find((z) => z.id === zoneId);
          if (match) {
            startTransition(() => {
              setSelectedZone(match);
              focusOnCoordinates(match.coordinates);
            });
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    setIsLoading(false);

    // Window Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  const filteredZones = EXTENDED_CAMPUS_ZONES.filter((zone) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      zone.name.toLowerCase().includes(q) ||
      zone.tag.toLowerCase().includes(q) ||
      zone.departmentsHoused.some((d) => d.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full space-y-4">
      {/* 3D Visualizer Canvas Frame */}
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-lg border border-zinc-200 bg-[#FAF8F5] overflow-hidden shadow-xs">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin mb-2" />
            <span className="text-xs font-mono text-zinc-600">Initializing SETGOI 3D Engine...</span>
          </div>
        )}

        {/* Canvas DOM Element */}
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top Control Bar Floating Overlay */}
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Quick Perspective Views */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-md border border-zinc-200 pointer-events-auto shadow-xs">
            <button
              onClick={() => setPresetView('iso')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                cameraView === 'iso' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Isometric 45°
            </button>
            <button
              onClick={() => setPresetView('front')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                cameraView === 'front' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Academic Core
            </button>
            <button
              onClick={() => setPresetView('gate')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                cameraView === 'gate' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Main Gate
            </button>
            <button
              onClick={() => setPresetView('top')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                cameraView === 'top' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Plan (2D)
            </button>
          </div>

          {/* Reset & Quick Helper */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => {
                if (selectedZone) focusOnCoordinates(selectedZone.coordinates);
                else setPresetView('iso');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 shadow-xs"
              title="Reset perspective"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <div className="px-2.5 py-1 text-[11px] font-mono text-zinc-500 bg-white/90 backdrop-blur-md rounded border border-zinc-200 hidden md:block">
              Left Click + Drag: Rotate • Right Click: Pan • Scroll: Zoom
            </div>
          </div>
        </div>

        {/* Bottom Floating Quick Zone Selector Pills */}
        <div className="absolute bottom-3 left-3 right-3 z-20 overflow-x-auto pb-1 scrollbar-none pointer-events-none flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/90 backdrop-blur-md border border-zinc-200 pointer-events-auto shadow-xs">
            <span className="text-[11px] font-mono uppercase text-zinc-400 px-2 font-medium">Zones:</span>
            {EXTENDED_CAMPUS_ZONES.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleSelectZone(zone)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {zone.tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Zone Deep Dive Card (Swiss 1px Border Light Mode Card) */}
      {selectedZone && (
        <div className="w-full bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs transition-all">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Zone Identity & Header */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-slate-100 text-[#0F172A] border border-[#E2E8F0] font-semibold">
                  {selectedZone.tag}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-mono text-[#475569]">
                  {selectedZone.levels} {selectedZone.levels === 1 ? 'Level' : 'Levels / Floors'}
                </span>
                {selectedZone.operatingHours && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#475569]">
                      <Clock className="w-3 h-3 text-[#475569]" />
                      {selectedZone.operatingHours}
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2 font-display">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                {selectedZone.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-sans">
                {selectedZone.description}
              </p>

              {/* Branch Pill Selector for Academic Core (Main Building) */}
              {selectedZone.id === 'zone-main' && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-[#475569] uppercase font-semibold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                      Select Academic Branch:
                    </span>
                    <span className="text-[11px] font-mono text-[#2563EB]">
                      Dynamically updates labs &amp; room numbers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(['CSE', 'ECE', 'EE', 'ME', 'CE', 'ALL'] as const).map((branch) => {
                      const isSelected = selectedBranch === branch;
                      return (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => setSelectedBranch(branch)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xs font-bold'
                              : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50 hover:text-[#0F172A] hover:border-slate-300'
                          }`}
                        >
                          {branch === 'ALL' ? 'All Floors' : `${branch} Labs & Rooms`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Departments Housed */}
              <div className="pt-1">
                <span className="text-xs font-mono text-[#475569] block mb-1.5 uppercase font-medium">
                  Departments &amp; Facilities In Zone:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.departmentsHoused.map((dept, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-medium font-sans"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {selectedZone.id === 'zone-main' && selectedBranch !== 'ALL' && onSelectDepartment && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectDepartment(selectedBranch)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium font-sans text-[#2563EB] hover:underline cursor-pointer"
                  >
                    <span>View {selectedBranch} Department Faculty &amp; Syllabi</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Floor Breakdown Table (Swiss Tabular Layout) */}
            <div className="w-full lg:w-[420px] shrink-0 bg-slate-50/80 rounded-xl border border-[#E2E8F0] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="text-xs font-mono uppercase text-[#0F172A] font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  {selectedZone.id === 'zone-main' && selectedBranch !== 'ALL'
                    ? `${selectedBranch} Floor & Lab Directory`
                    : 'Floor-by-Floor Directory'}
                </span>
                <span className="text-[11px] font-mono text-[#475569] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                  {selectedZone.id === 'zone-main' && selectedBranch !== 'ALL'
                    ? `${MAIN_BUILDING_BRANCH_FLOORS[selectedBranch].length} Levels Active`
                    : `${selectedZone.floorsDetail?.length || selectedZone.levels} Levels`}
                </span>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs divide-y divide-[#E2E8F0]">
                {selectedZone.id === 'zone-main' && selectedBranch !== 'ALL' ? (
                  MAIN_BUILDING_BRANCH_FLOORS[selectedBranch].map((fl, idx) => (
                    <div key={idx} className="pt-2 first:pt-0">
                      <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0F172A] mb-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                          {fl.floor}
                        </span>
                        <span className="text-[10px] text-[#475569] font-normal">
                          {fl.labsCount} Labs/Rooms
                        </span>
                      </div>
                      <ul className="text-[#475569] mt-0.5 space-y-1 pl-3 text-[11px] font-sans">
                        {fl.facilities.map((fac, fIdx) => (
                          <li key={fIdx} className="leading-snug list-disc">
                            {fac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  selectedZone.floorsDetail?.map((fl, idx) => (
                    <div key={idx} className="pt-2 first:pt-0">
                      <div className="font-mono text-[11px] font-bold text-[#0F172A] mb-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                        {fl.floor}
                      </div>
                      <ul className="text-[#475569] mt-0.5 space-y-1 pl-3 text-[11px] font-sans">
                        {fl.facilities.map((fac, fIdx) => (
                          <li key={fIdx} className="leading-snug list-disc">
                            {fac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
