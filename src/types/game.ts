
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
  is_starter: boolean;
  is_substitute: boolean;
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
  tactic?: string;
  training: TrainingType;
  preTalkType: PreTalkType;
}

export interface League {
  id: string;
  name: string;
  season: string;
  createdBy: string;
  inviteCode: string;
  maxTeams: number;
  currentTeams: number;
  currentRound: number;
  nextMatchDate?: string;
  status: 'recruiting' | 'active' | 'finished';
}

export interface Manager {
  id: string;
  userId: string;
  name: string;
  email: string;
  level: number;
  experience: number;
  current_club_id: string | null;
  salary: number;
  reputation: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  status: 'scheduled' | 'live' | 'finished';
  score: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
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

export type TrainingType = 'physical' | 'tactical' | 'technical' | 'mental';
export type PreTalkType = 'motivational' | 'tactical' | 'pressure' | 'relaxed';
