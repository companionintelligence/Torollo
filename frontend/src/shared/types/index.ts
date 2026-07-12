/** Shared type definitions for the Akal Systems Lab frontend */

export interface ContainerData {
  id: string;
  name: string;
  state: string;
  status: string;
  type?: 'ubuntu' | 'postgres' | 'mysql' | 'sql' | 'nosql' | 'redis' | 'nat' | 'loadbalancer' | 'autoscalinggroup';
  port?: string;
  ip?: string;
  image?: string;
  asgId?: string;
  isAsgInstance?: boolean;
}


export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
}

export interface TerminalInfo {
  id: string;
  name: string;
}

/**
 * API base URL for the backend.
 * In production the backend serves the built frontend itself (same origin,
 * single port), so requests are relative rather than hardcoded to localhost
 * — that hardcoding broke every deployment reached through a reverse proxy
 * or tunnel instead of directly on the host running Docker.
 */
export const API_BASE = import.meta.env.DEV
  ? 'http://localhost:23233'
  : '';
