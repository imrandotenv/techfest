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
  GraduationCap,
  X
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
  const [isInspectDrawerOpen, setIsInspectDrawerOpen] = useState(false);
  const [isCutawayView, setIsCutawayView] = useState(false);
  const [, startTransition] = useTransition();

  // Three.js internal references for interaction
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const blueWallMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

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

  // Keyboard shortcut 'C' for Interior Cutaway View (from Sanaka Hub campus-map.js)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (e.key.toLowerCase() === 'c' && tag !== 'input' && tag !== 'textarea') {
        setIsCutawayView((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update wall transparency on cutaway toggle
  useEffect(() => {
    if (blueWallMatRef.current) {
      blueWallMatRef.current.transparent = isCutawayView;
      blueWallMatRef.current.opacity = isCutawayView ? 0.35 : 1.0;
      blueWallMatRef.current.needsUpdate = true;
    }
  }, [isCutawayView]);

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
    blueWallMatRef.current = blueWallMat;
    const blueTrimMat = new THREE.MeshStandardMaterial({ color: '#285779', roughness: 0.8 });
    const stoneWallMat = new THREE.MeshStandardMaterial({ color: '#D8D0C3', roughness: 0.9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: '#89949A', metalness: 0.65, roughness: 0.35 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#74A7C9', metalness: 0.8, roughness: 0.1 });
    const whiteLineMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 });
    const burgundyMat = new THREE.MeshStandardMaterial({ color: '#702D3B', roughness: 0.8 });
    const libraryMat = new THREE.MeshStandardMaterial({ color: '#3E6B89', roughness: 0.8 });
    const workshopMat = new THREE.MeshStandardMaterial({ color: '#606C38', roughness: 0.85 });
    const civilLabMat = new THREE.MeshStandardMaterial({ color: '#3A506B', roughness: 0.8 });

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

    // Interior Central Library & Computer Labs (Visible in Cutaway View - Ported from Sanaka Hub)
    const interiorGroup = new THREE.Group();
    interiorGroup.name = 'InteriorCutawayGroup';

    // Library Study Tables in Rear Wing (10 tables in 2 rows)
    const woodMat = new THREE.MeshStandardMaterial({ color: '#8B5A2B', roughness: 0.8 });
    const screenMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.3 });
    for (let row = 0; row < 2; row++) {
      for (let col = -10; col <= 10; col += 5) {
        addBoxMesh(interiorGroup, 2.2, 0.7, 1.4, col, 0.35, -16 + (row === 0 ? -1.8 : 1.8), woodMat);
      }
    }
    // Library Book Stacks
    for (const bx of [-12, -7, 7, 12]) {
      addBoxMesh(interiorGroup, 0.8, 2.4, 4.5, bx, 1.2, -16, burgundyMat);
    }

    // Computer Lab Workstations (Right Wing)
    for (let rz = -10; rz <= 6; rz += 3.5) {
      addBoxMesh(interiorGroup, 4.5, 0.7, 1.2, 12, 0.35, rz, stoneWallMat);
      // Dual monitors on bench
      addBoxMesh(interiorGroup, 0.8, 0.5, 0.1, 11, 0.95, rz, screenMat);
      addBoxMesh(interiorGroup, 0.8, 0.5, 0.1, 13, 0.95, rz, screenMat);
    }
    mainBuildingGroup.add(interiorGroup);

    scene.add(mainBuildingGroup);
    zoneGroups.push(mainBuildingGroup);
    meshesMap.set('zone-main', mainBuildingGroup);

    // 2. MAIN ENTRANCE ARCH FACADE & GATES (Ported from Sanaka Hub campus-map.js)
    const entranceGroup = new THREE.Group();
    entranceGroup.userData = { zoneId: 'zone-entrance', slug: 'entrance-portal' };

    // Arch-shaped entrance facade with ExtrudeGeometry and circular opening
    const facadeShape = new THREE.Shape();
    facadeShape.moveTo(-14, 0);
    facadeShape.lineTo(14, 0);
    facadeShape.lineTo(14, 10);
    facadeShape.lineTo(-14, 10);
    facadeShape.closePath();

    const entranceOpening = new THREE.Path();
    entranceOpening.moveTo(-5.5, 0);
    entranceOpening.lineTo(-5.5, 4.5);
    entranceOpening.absarc(0, 4.5, 5.5, Math.PI, 0, true);
    entranceOpening.lineTo(5.5, 0);
    entranceOpening.closePath();
    facadeShape.holes.push(entranceOpening);

    const facadeGeo = new THREE.ExtrudeGeometry(facadeShape, { depth: 4.5, bevelEnabled: false });
    const entranceFacadeMesh = new THREE.Mesh(facadeGeo, stoneWallMat);
    entranceFacadeMesh.position.set(0, 0, 27.5);
    entranceFacadeMesh.castShadow = true;
    entranceFacadeMesh.receiveShadow = true;
    entranceGroup.add(entranceFacadeMesh);

    // Blue glass side panels
    addBoxMesh(entranceGroup, 4.5, 6.5, 0.2, -10.5, 5, 32.2, glassMat);
    addBoxMesh(entranceGroup, 4.5, 6.5, 0.2, 10.5, 5, 32.2, glassMat);

    // Institutional Name Band
    addBoxMesh(entranceGroup, 14, 0.9, 0.2, 0, 8.2, 32.3, blueTrimMat);

    // Two vehicle pavements (left & right)
    addBoxMesh(entranceGroup, 4.5, 0.15, 18, -4.5, 0.05, 35, asphaltMat);
    addBoxMesh(entranceGroup, 4.5, 0.15, 18, 4.5, 0.05, 35, asphaltMat);

    // Solid curved grass island in between pavements
    const grassIslandShape = new THREE.Shape();
    grassIslandShape.moveTo(-1.6, 0);
    grassIslandShape.lineTo(-1.6, 12);
    grassIslandShape.quadraticCurveTo(-1.6, 14, 0, 14);
    grassIslandShape.quadraticCurveTo(1.6, 14, 1.6, 12);
    grassIslandShape.lineTo(1.6, 0);
    grassIslandShape.closePath();

    const grassIslandGeo = new THREE.ShapeGeometry(grassIslandShape, 24);
    const islandMat = new THREE.MeshStandardMaterial({ color: '#319447', roughness: 0.9 });
    const grassIslandMesh = new THREE.Mesh(grassIslandGeo, islandMat);
    grassIslandMesh.rotation.x = -Math.PI / 2;
    grassIslandMesh.position.set(0, 0.12, 44);
    grassIslandMesh.receiveShadow = true;
    entranceGroup.add(grassIslandMesh);

    // Sliding metal security gates with vertical bars
    for (const gx of [-4.5, 4.5]) {
      addBoxMesh(entranceGroup, 4.8, 0.12, 0.12, gx, 2.2, 44.2, metalMat);
      addBoxMesh(entranceGroup, 4.8, 0.12, 0.12, gx, 0.35, 44.2, metalMat);
      for (let bar = -2.0; bar <= 2.0; bar += 0.5) {
        addBoxMesh(entranceGroup, 0.08, 1.9, 0.08, gx + bar, 1.25, 44.2, metalMat);
      }
    }
    // Central white gate divider
    addBoxMesh(entranceGroup, 0.8, 2.6, 0.8, 0, 1.3, 44.2, stoneWallMat);

    scene.add(entranceGroup);
    zoneGroups.push(entranceGroup);
    meshesMap.set('zone-entrance', entranceGroup);

    // Courtyard Shrine Feature (Ported from Sanaka Hub campus-map.js)
    const shrineGroup = new THREE.Group();
    addBoxMesh(shrineGroup, 4.2, 0.4, 4.2, 0, 0.2, -3, stoneWallMat); // Shrine Base
    addBoxMesh(shrineGroup, 2.4, 2.6, 2.4, 0, 1.6, -3, burgundyMat);   // Shrine Structure
    addBoxMesh(shrineGroup, 3.8, 0.45, 3.8, 0, 3.1, -3, stoneWallMat); // Tiered Roof
    scene.add(shrineGroup);

    // Garden Trees around courtyard and perimeter
    const addTree = (tx: number, tz: number) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: '#5C4033', roughness: 0.9 })
      );
      trunk.position.set(tx, 1.1, tz);
      trunk.castShadow = true;
      scene.add(trunk);

      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 10, 10),
        new THREE.MeshStandardMaterial({ color: '#3F7848', roughness: 0.85 })
      );
      leaves.position.set(tx, 3.0, tz);
      leaves.castShadow = true;
      scene.add(leaves);
    };

    addTree(6, -6);
    addTree(-6, -6);
    addTree(6, 2);
    addTree(-6, 2);
    addTree(18, 14);
    addTree(-18, 14);

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

    // 4. CENTRAL COMPUTING & ADVANCED IT LAB WING
    const computingGroup = new THREE.Group();
    computingGroup.userData = { zoneId: 'zone-computing-wing', slug: 'computing-wing' };
    addBoxMesh(computingGroup, 18, 9, 14, -28, 4.5, -15, blueTrimMat);
    addBoxMesh(computingGroup, 19, 0.35, 15, -28, 9.2, -15, stoneWallMat); // roof trim
    // Windows
    for (let row = 1; row <= 3; row++) {
      const wy = row * 2.5;
      for (let wx = -34; wx <= -22; wx += 2.8) {
        addBoxMesh(computingGroup, 1.2, 1.3, 0.1, wx, wy, -7.9, glassMat);
      }
    }
    scene.add(computingGroup);
    zoneGroups.push(computingGroup);
    meshesMap.set('zone-computing-wing', computingGroup);

    // 5. ELECTRICAL & EMBEDDED RESEARCH COMPLEX
    const electricalGroup = new THREE.Group();
    electricalGroup.userData = { zoneId: 'zone-electrical-wing', slug: 'electrical-wing' };
    addBoxMesh(electricalGroup, 18, 9, 14, 28, 4.5, -15, blueTrimMat);
    addBoxMesh(electricalGroup, 19, 0.35, 15, 28, 9.2, -15, stoneWallMat);
    for (let row = 1; row <= 3; row++) {
      const wy = row * 2.5;
      for (let wx = 22; wx <= 34; wx += 2.8) {
        addBoxMesh(electricalGroup, 1.2, 1.3, 0.1, wx, wy, -7.9, glassMat);
      }
    }
    scene.add(electricalGroup);
    zoneGroups.push(electricalGroup);
    meshesMap.set('zone-electrical-wing', electricalGroup);

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

    // 8. CIVIL & HEAVY TESTING LAB BLOCK (West Wing)
    const civilGroup = new THREE.Group();
    civilGroup.userData = { zoneId: 'zone-civil-wing', slug: 'civil-wing' };
    addBoxMesh(civilGroup, 16, 10, 14, -16, 5, -34, civilLabMat);
    addBoxMesh(civilGroup, 17, 0.3, 15, -16, 10.15, -34, stoneWallMat);
    for (let r = 1; r <= 3; r++) {
      const wy = r * 2.8;
      for (let wx = -22; wx <= -10; wx += 3) {
        addBoxMesh(civilGroup, 1.4, 1.4, 0.1, wx, wy, -26.9, glassMat);
      }
    }
    scene.add(civilGroup);
    zoneGroups.push(civilGroup);
    meshesMap.set('zone-civil-wing', civilGroup);

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
            <button
              onClick={() => setIsCutawayView((prev) => !prev)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors inline-flex items-center gap-1.5 ${
                isCutawayView ? 'bg-[#2563EB] text-white font-bold' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              title="Toggle interior labs & library cutaway (Press 'C')"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isCutawayView ? 'Exterior Shell' : 'Interior Cutaway'}</span>
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

      {/* Compact Building Status Bar with Inspect Floors Trigger (Replaces Permanent Clutter) */}
      {selectedZone && (
        <div className="w-full bg-white border border-[#E4E4E7] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-[#52525B] font-semibold">
                  {selectedZone.tag}
                </span>
                <span className="text-xs font-mono text-[#52525B]">
                  {selectedZone.levels} {selectedZone.levels === 1 ? 'Level' : 'Floors'}
                </span>
                {selectedZone.operatingHours && (
                  <span className="text-xs font-mono text-[#52525B] hidden md:inline">
                    • {selectedZone.operatingHours}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[#09090B] font-display mt-0.5">
                {selectedZone.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsInspectDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold font-sans transition-all shadow-xs cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Floors →</span>
            </button>
          </div>
        </div>
      )}

      {/* Slide-Over Drawer for Floor-by-Floor Lab Directory */}
      {isInspectDrawerOpen && selectedZone && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsInspectDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col z-10 border-l border-[#E4E4E7] overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E4E4E7] flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#09090B] font-display">
                    {selectedZone.name}
                  </h3>
                  <p className="text-xs text-[#52525B] font-mono">
                    Floor-by-Floor Labs &amp; Facilities
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInspectDrawerOpen(false)}
                className="p-1.5 rounded-full text-[#52525B] hover:text-[#09090B] hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Branch Pill Selector for Academic Core (Main Building) */}
              {selectedZone.id === 'zone-main' && (
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#09090B] font-bold flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                      Select Academic Branch:
                    </span>
                    <span className="text-[11px] font-mono text-[#2563EB]">
                      Filters Labs Live
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
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-2xs'
                              : 'bg-white text-[#52525B] border-[#E4E4E7] hover:bg-zinc-50 hover:text-[#09090B]'
                          }`}
                        >
                          {branch === 'ALL' ? 'All Floors' : branch}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Floor Listings */}
              <div className="space-y-3">
                {selectedZone.id === 'zone-main' && selectedBranch !== 'ALL' ? (
                  MAIN_BUILDING_BRANCH_FLOORS[selectedBranch].map((fl, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#E4E4E7] bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between font-mono text-xs font-bold text-[#09090B]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          {fl.floor}
                        </span>
                        <span className="text-[11px] text-[#52525B] font-normal">
                          {fl.labsCount} Labs
                        </span>
                      </div>
                      <ul className="text-[#52525B] space-y-1.5 pl-4 text-xs font-sans list-disc">
                        {fl.facilities.map((fac, fIdx) => (
                          <li key={fIdx} className="leading-relaxed">
                            {fac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  selectedZone.floorsDetail?.map((fl, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-[#E4E4E7] bg-white space-y-2"
                    >
                      <div className="font-mono text-xs font-bold text-[#09090B] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#09090B]" />
                        {fl.floor}
                      </div>
                      <ul className="text-[#52525B] space-y-1.5 pl-4 text-xs font-sans list-disc">
                        {fl.facilities.map((fac, fIdx) => (
                          <li key={fIdx} className="leading-relaxed">
                            {fac}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E4E4E7] bg-zinc-50 flex items-center justify-between">
              <span className="text-xs font-mono text-[#52525B]">
                SETGOI Infrastructure Directory
              </span>
              <button
                type="button"
                onClick={() => setIsInspectDrawerOpen(false)}
                className="px-4 py-2 rounded-full bg-zinc-200 hover:bg-zinc-300 text-xs font-medium text-[#09090B] transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
