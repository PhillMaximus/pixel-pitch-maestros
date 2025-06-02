
export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'ATK';
  age: number;
  overall: number;
  potential: number;
  price: number;
  salary: number;
  stamina: number;
  morale: number;
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    defending: number;
    dribbling: number;
    physical: number;
  };
}

export interface Club {
  id: string;
  name: string;
  reputation: number;
  budget: number;
  league: string;
  stadium: {
    name: string;
    capacity: number;
  };
  players: Player[];
  formation: string;
  tactic: string;
  lineup?: string[];
  substitutes?: string[];
  training?: TrainingType;
  preTalkType?: PreTalkType;
}

export interface Manager {
  id: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  currentClub: string;
  salary: number;
  reputation: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  date: string;
  type: 'championship' | 'cup' | 'milestone';
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: 'scheduled' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  events?: MatchEvent[];
  round: number;
  leagueId: string;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card' | 'substitution';
  player: string;
  team: 'home' | 'away';
  description: string;
}

export interface League {
  id: string;
  name: string;
  season: string;
  teams: Club[];
  matches: Match[];
  table: LeagueTable[];
  createdBy: string;
  inviteCode: string;
  maxTeams: number;
  currentRound: number;
  nextMatchDate: string;
}

export interface LeagueTable {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  manager?: Manager;
  currentScreen: 'login' | 'home' | 'club-selection' | 'dashboard' | 'league-creation' | 'league-browser';
}

export type TrainingType = 'physical' | 'tactical' | 'technical' | 'rest';
export type PreTalkType = 'motivational' | 'aggressive' | 'calm' | 'tactical';
export type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2' | '4-2-3-1';
