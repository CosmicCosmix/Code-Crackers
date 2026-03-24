import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

// --- Composed 3D Furniture Models ---
function FurnitureMesh({ type, size, color }) {
  const [w, h, d] = size;

  switch (type) {
    case 'Sofa':
    case 'Armchair':
      return (
        <group>
          {/* Seat */}
          <mesh position={[0, -h*0.2, d*0.1]} castShadow receiveShadow>
            <boxGeometry args={[w*0.8, h*0.6, d*0.8]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, h*0.1, -d*0.35]} castShadow receiveShadow>
            <boxGeometry args={[w*0.8, h*0.8, d*0.3]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Armrests */}
          <mesh position={[-w*0.45, -h*0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.1, h*0.9, d]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          <mesh position={[w*0.45, -h*0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.1, h*0.9, d]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
        </group>
      );
    case 'Coffee Table':
    case 'Dining Table':
      return (
        <group>
          {/* Table Top */}
          <mesh position={[0, h*0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h*0.1, d]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
          {/* Legs */}
          {[-1, 1].map(x => [-1, 1].map(z => (
            <mesh key={`${x}-${z}`} position={[x * w*0.4, -h*0.05, z * d*0.4]} castShadow receiveShadow>
              <cylinderGeometry args={[w*0.03, w*0.02, h*0.9, 16]} />
              <meshStandardMaterial color="#4A3B32" />
            </mesh>
          )))}
        </group>
      );
    case 'Double Bed':
      return (
        <group>
          {/* Base Frame */}
          <mesh position={[0, -h*0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h*0.5, d]} />
            <meshStandardMaterial color="#6B5B42" />
          </mesh>
          {/* Mattress */}
          <mesh position={[0, h*0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.95, h*0.3, d*0.95]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          {/* Headboard */}
          <mesh position={[0, h*0.8, -d*0.45]} castShadow receiveShadow>
            <boxGeometry args={[w, h*1.6, d*0.1]} />
            <meshStandardMaterial color="#6B5B42" />
          </mesh>
          {/* Pillows */}
          <mesh position={[-w*0.25, h*0.35, -d*0.3]} castShadow receiveShadow>
            <boxGeometry args={[w*0.3, h*0.15, d*0.15]} />
            <meshStandardMaterial color="#fff" roughness={0.9} />
          </mesh>
          <mesh position={[w*0.25, h*0.35, -d*0.3]} castShadow receiveShadow>
            <boxGeometry args={[w*0.3, h*0.15, d*0.15]} />
            <meshStandardMaterial color="#fff" roughness={0.9} />
          </mesh>
        </group>
      );
    case 'Bookshelf':
      return (
        <group>
          {/* Outer Frame */}
          <mesh position={[-w*0.45, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.1, h, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[w*0.45, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.1, h, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, h*0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.8, h*0.1, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, -h*0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[w*0.8, h*0.1, d]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Back panel */}
          <mesh position={[0, 0, -d*0.45]} castShadow receiveShadow>
            <boxGeometry args={[w*0.8, h*0.8, d*0.1]} />
            <meshStandardMaterial color={color} />
          </mesh>
          {/* Shelves */}
          {[-0.2, 0.15].map(y => (
            <mesh key={y} position={[0, h*y, 0]} castShadow receiveShadow>
              <boxGeometry args={[w*0.8, h*0.05, d*0.9]} />
              <meshStandardMaterial color={color} />
            </mesh>
          ))}
        </group>
      );
    case 'Plant Pot':
      return (
        <group>
          {/* Pot */}
          <mesh position={[0, -h*0.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[w*0.4, w*0.3, h*0.5, 32]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
          {/* Plant Top (Sphere abstraction) */}
          <mesh position={[0, h*0.25, 0]} castShadow receiveShadow>
            <dodecahedronGeometry args={[w*0.6, 1]} />
            <meshStandardMaterial color="#4CAF50" roughness={0.8} />
          </mesh>
        </group>
      );
    case 'Rug (Flat)':
      return (
        <mesh position={[0, -h*0.4, 0]} receiveShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      );
    default:
      // Fallback simple block
      return (
        <mesh castShadow receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color={color} />
        </mesh>
      );
  }
}

// --- Interactive Draggable Wrapper ---
function DraggableGroup({ item, isActive, setActiveId, updateItem, orbitControlsRef }) {
  const groupRef = useRef();
  const { camera, raycaster, pointer } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  // Mathematical plane at the floor level for raycasting
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.01);

  // Sync internal ref position with props if not dragging
  useEffect(() => {
    if (groupRef.current && !isDragging) {
      groupRef.current.position.set(...item.position);
      groupRef.current.rotation.set(...(item.rotation || [0,0,0]));
    }
  }, [item.position, item.rotation, isDragging]);

  const onPointerDown = (e) => {
    e.stopPropagation();
    setActiveId(item.id);
    setIsDragging(true);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      e.target.releasePointerCapture(e.pointerId);
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
      
      // Persist the final position coordinate to the React state history
      if (groupRef.current) {
        updateItem(item.id, { 
          position: [groupRef.current.position.x, item.position[1], groupRef.current.position.z]
        });
      }
    }
  };

  const onPointerMove = (e) => {
    if (isDragging && groupRef.current) {
      e.stopPropagation();
      
      raycaster.setFromCamera(pointer, camera);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        // Snap logic: Snap to nearest 0.5m grid
        const snap = 0.5;
        const snapX = Math.round(intersection.x / snap) * snap;
        const snapZ = Math.round(intersection.z / snap) * snap;

        groupRef.current.position.x = snapX;
        groupRef.current.position.z = snapZ;
      }
    }
  };

  return (
    <group 
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <FurnitureMesh type={item.type} size={item.size} color={item.color} />
      
      {/* Highlighting outline when active */}
      {isActive && (
        <mesh position={[0, -item.size[1]*0.48 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[item.size[0] + 0.2, item.size[2] + 0.2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.10} depthTest={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

export default function Room3DWorkspace({ items, onUpdateItem, activeId, setActiveId }) {
  const orbitRef = useRef();

  // Clear active ID if clicking empty space
  const handleMissed = () => {
    setActiveId(null);
  };

  return (
    <Canvas camera={{ position: [0, 15, 4], fov: 40 }} onPointerMissed={handleMissed} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
        shadow-bias={-0.0001}
      />
      
      {/* Floor Grid & Plane */}
      <Grid args={[20, 20]} sectionColor={'#D0D0D0'} cellColor={'#EAEAEA'} position={[0, -0.01, 0]} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onPointerDown={(e) => { e.stopPropagation(); handleMissed(); }}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
      </mesh>

      {/* Furniture Blocks */}
      {items.map(item => (
        <DraggableGroup 
          key={item.id} 
          item={item} 
          isActive={activeId === item.id} 
          setActiveId={setActiveId} 
          updateItem={onUpdateItem} 
          orbitControlsRef={orbitRef}
        />
      ))}

      {/* Orbital Camera Controls - Bird's eye restriction */}
      <OrbitControls ref={orbitRef} makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 3} minDistance={5} maxDistance={25} />
    </Canvas>
  );
}
