
import { Player, Club, League, Manager } from '@/types/game';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Manuel Neuer',
    position: 'GK',
    age: 37,
    overall: 89,
    potential: 89,
    price: 15000000,
    salary: 200000,
    stamina: 85,
    morale: 90,
    is_starter: false,
    is_substitute: false,
    attributes: {
      pace: 58,
      shooting: 25,
      passing: 91,
      defending: 35,
      dribbling: 48,
      physical: 83
    }
  },
  {
    id: '2',
    name: 'Virgil van Dijk',
    position: 'DEF',
    age: 32,
    overall: 90,
    potential: 90,
    price: 45000000,
    salary: 250000,
    stamina: 88,
    morale: 92,
    is_starter: false,
    is_substitute: false,
    attributes: {
      pace: 77,
      shooting: 60,
      passing: 91,
      defending: 96,
      dribbling: 72,
      physical: 97
    }
  },
  {
    id: '3',
    name: 'Kevin De Bruyne',
    position: 'MID',
    age: 32,
    overall: 91,
    potential: 91,
    price: 70000000,
    salary: 300000,
    stamina: 85,
    morale: 88,
    is_starter: false,
    is_substitute: false,
    attributes: {
      pace: 76,
      shooting: 86,
      passing: 93,
      defending: 64,
      dribbling: 88,
      physical: 78
    }
  },
  {
    id: '4',
    name: 'Erling Haaland',
    position: 'ATK',
    age: 23,
    overall: 88,
    potential: 94,
    price: 100000000,
    salary: 350000,
    stamina: 90,
    morale: 95,
    is_starter: false,
    is_substitute: false,
    attributes: {
      pace: 89,
      shooting: 91,
      passing: 65,
      defending: 45,
      dribbling: 80,
      physical: 88
    }
  }
];

const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Bayern Munich',
    reputation: 95,
    budget: 200000000,
    league: 'Bundesliga',
    formation: '4-3-3',
    training: 'fitness',
    preTalkType: 'motivational',
    stadium: {
      name: 'Allianz Arena',
      capacity: 75000
    },
    players: mockPlayers
  },
  {
    id: '2',
    name: 'Real Madrid',
    reputation: 98,
    budget: 300000000,
    league: 'La Liga',
    formation: '4-3-3',
    training: 'fitness',
    preTalkType: 'motivational',
    stadium: {
      name: 'Santiago Bernabéu',
      capacity: 81044
    },
    players: []
  }
];

const mockLeagues: League[] = [
  {
    id: '1',
    name: 'Premier League',
    createdBy: 'admin',
    maxTeams: 20,
    currentTeams: 18,
    status: 'active',
    season: '2024/25'
  }
];

export const gameService = {
  async getAvailableClubs(): Promise<Club[]> {
    return mockClubs;
  },

  async getManagerByUserId(userId: string): Promise<Manager | null> {
    return {
      id: '1',
      userId,
      email: 'joao@example.com',
      name: 'João Silva',
      level: 1,
      experience: 0,
      reputation: 50,
      salary: 50000,
      currentClubId: null
    };
  },

  async getClubById(clubId: string): Promise<Club | null> {
    return mockClubs.find(club => club.id === clubId) || null;
  },

  async updateLineup(clubId: string, lineup: Player[], substitutes: Player[]): Promise<void> {
    console.log('Lineup updated for club:', clubId);
  },

  async createLeague(league: Omit<League, 'id' | 'currentTeams'>): Promise<League> {
    return {
      id: Date.now().toString(),
      currentTeams: 0,
      ...league
    };
  },

  async getAvailableLeagues(): Promise<League[]> {
    return mockLeagues;
  },

  async joinLeague(leagueId: string, clubId: string): Promise<void> {
    console.log(`Club ${clubId} joined league ${leagueId}`);
  },

  async simulateMatches(leagueId: string): Promise<void> {
    console.log(`Simulating matches for league ${leagueId}`);
  },

  async selectClub(userId: string, clubId: string): Promise<Manager> {
    return {
      id: '1',
      userId,
      email: 'joao@example.com',
      name: 'João Silva',
      level: 1,
      experience: 0,
      reputation: 50,
      salary: 50000,
      currentClubId: clubId
    };
  }
};
