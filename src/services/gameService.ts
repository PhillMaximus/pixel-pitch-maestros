import { Player, Club, Manager, Match, League, LeagueTable, TrainingType, PreTalkType } from '@/types/game';

// Dados simulados para demonstração
const SAMPLE_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'João Silva',
    position: 'GK',
    age: 25,
    overall: 75,
    potential: 80,
    price: 50000,
    salary: 5000,
    stamina: 100,
    morale: 80,
    attributes: {
      pace: 60,
      shooting: 30,
      passing: 70,
      defending: 85,
      dribbling: 40,
      physical: 80
    }
  },
  {
    id: '2',
    name: 'Pedro Santos',
    position: 'DEF',
    age: 28,
    overall: 78,
    potential: 78,
    price: 80000,
    salary: 7000,
    stamina: 95,
    morale: 85,
    attributes: {
      pace: 70,
      shooting: 40,
      passing: 75,
      defending: 88,
      dribbling: 50,
      physical: 85
    }
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    position: 'MID',
    age: 24,
    overall: 82,
    potential: 90,
    price: 120000,
    salary: 10000,
    stamina: 90,
    morale: 90,
    attributes: {
      pace: 80,
      shooting: 75,
      passing: 90,
      defending: 60,
      dribbling: 85,
      physical: 70
    }
  },
  {
    id: '4',
    name: 'Rafael Costa',
    position: 'ATK',
    age: 22,
    overall: 80,
    potential: 88,
    price: 100000,
    salary: 8000,
    stamina: 85,
    morale: 95,
    attributes: {
      pace: 90,
      shooting: 88,
      passing: 70,
      defending: 30,
      dribbling: 90,
      physical: 75
    }
  }
];

const SAMPLE_CLUBS: Club[] = [
  {
    id: 'club1',
    name: 'FC Esperança',
    reputation: 65,
    budget: 500000,
    league: 'Liga Regional',
    stadium: {
      name: 'Estádio da Esperança',
      capacity: 15000
    },
    players: SAMPLE_PLAYERS,
    formation: '4-4-2',
    tactic: 'balanced'
  },
  {
    id: 'club2',
    name: 'Atlético Cidade',
    reputation: 70,
    budget: 750000,
    league: 'Liga Regional',
    stadium: {
      name: 'Arena Cidade',
      capacity: 20000
    },
    players: [],
    formation: '4-3-3',
    tactic: 'attacking'
  }
];

const SAMPLE_LEAGUES: League[] = [
  {
    id: 'league1',
    name: 'Liga dos Amigos',
    season: '2024',
    teams: [],
    matches: [],
    table: [],
    createdBy: 'user1',
    inviteCode: 'ABC123',
    maxTeams: 8,
    currentRound: 1,
    nextMatchDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];

export class GameService {
  static getPlayersByPosition(position?: string): Player[] {
    if (!position) return SAMPLE_PLAYERS;
    return SAMPLE_PLAYERS.filter(player => player.position === position);
  }

  static getClubById(clubId: string): Club | null {
    return SAMPLE_CLUBS.find(club => club.id === clubId) || null;
  }

  static getAllClubs(): Club[] {
    return SAMPLE_CLUBS;
  }

  static createManagerForUser(name: string, email: string, clubId: string): Manager {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      level: 1,
      experience: 0,
      currentClub: clubId,
      salary: 15000,
      reputation: 50,
      achievements: []
    };
  }

  static getAvailableClubsForSelection(): Club[] {
    return SAMPLE_CLUBS.filter(club => club.reputation <= 70);
  }

  static updateClubTraining(clubId: string, training: TrainingType): void {
    const club = SAMPLE_CLUBS.find(c => c.id === clubId);
    if (club) {
      club.training = training;
      console.log(`Clube ${club.name} está treinando: ${training}`);
    }
  }

  static updateClubFormation(clubId: string, formation: string): void {
    const club = SAMPLE_CLUBS.find(c => c.id === clubId);
    if (club) {
      club.formation = formation;
      console.log(`Clube ${club.name} mudou formação para: ${formation}`);
    }
  }

  static updateClubLineup(clubId: string, lineup: string[], substitutes: string[]): void {
    const club = SAMPLE_CLUBS.find(c => c.id === clubId);
    if (club) {
      club.lineup = lineup;
      club.substitutes = substitutes;
      console.log(`Escalação atualizada para ${club.name}`);
    }
  }

  static setPreTalk(clubId: string, preTalkType: PreTalkType): void {
    const club = SAMPLE_CLUBS.find(c => c.id === clubId);
    if (club) {
      club.preTalkType = preTalkType;
      console.log(`Preleção definida: ${preTalkType}`);
    }
  }

  static createLeague(name: string, maxTeams: number, createdBy: string): League {
    const inviteCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newLeague: League = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      season: '2024',
      teams: [],
      matches: [],
      table: [],
      createdBy,
      inviteCode,
      maxTeams,
      currentRound: 1,
      nextMatchDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    SAMPLE_LEAGUES.push(newLeague);
    return newLeague;
  }

  static joinLeague(leagueId: string, club: Club): boolean {
    const league = SAMPLE_LEAGUES.find(l => l.id === leagueId);
    if (league && league.teams.length < league.maxTeams) {
      league.teams.push(club);
      return true;
    }
    return false;
  }

  static getAvailableLeagues(): League[] {
    return SAMPLE_LEAGUES;
  }

  static getLeagueByInviteCode(inviteCode: string): League | null {
    return SAMPLE_LEAGUES.find(league => league.inviteCode === inviteCode) || null;
  }

  static simulateMatch(homeTeam: string, awayTeam: string, leagueId: string): Match {
    const homeScore = Math.floor(Math.random() * 4);
    const awayScore = Math.floor(Math.random() * 4);
    
    return {
      id: `match_${Date.now()}`,
      homeTeam,
      awayTeam,
      date: new Date().toISOString(),
      status: 'finished',
      leagueId,
      round: 1,
      score: {
        home: homeScore,
        away: awayScore
      },
      events: []
    };
  }

  static calculateTeamOverall(players: Player[]): number {
    if (players.length === 0) return 0;
    const total = players.reduce((sum, player) => sum + player.overall, 0);
    return Math.round(total / players.length);
  }

  static generateRandomMatch(homeTeam: string, awayTeam: string): Match {
    const homeScore = Math.floor(Math.random() * 4);
    const awayScore = Math.floor(Math.random() * 4);
    
    return {
      id: `match_${Date.now()}`,
      homeTeam,
      awayTeam,
      date: new Date().toISOString(),
      status: 'finished',
      round: 1,
      leagueId: 'default',
      score: {
        home: homeScore,
        away: awayScore
      },
      events: []
    };
  }

  static getManagerStartingData(): Manager {
    return {
      id: 'manager1',
      name: 'Novo Treinador',
      email: 'novo@treinador.com',
      level: 1,
      experience: 0,
      currentClub: 'club1',
      salary: 15000,
      reputation: 50,
      achievements: []
    };
  }
}
