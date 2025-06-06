import { supabase } from '@/integrations/supabase/client';
import { Player, Club, League, Match, MatchEvent, LeagueTable, TrainingType, PreTalkType } from '@/types/game';

export class SupabaseGameService {
  // Clube
  static async getClubById(clubId: string): Promise<Club | null> {
    try {
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', clubId)
        .single();

      if (clubError) throw clubError;

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('club_id', clubId);

      if (playersError) throw playersError;

      const players: Player[] = playersData.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position as 'GK' | 'DEF' | 'MID' | 'ATK',
        age: p.age,
        overall: p.overall,
        potential: p.potential,
        price: p.price,
        salary: p.salary,
        stamina: p.stamina,
        morale: p.morale,
        is_starter: p.is_starter,
        is_substitute: p.is_substitute,
        attributes: {
          pace: p.pace,
          shooting: p.shooting,
          passing: p.passing,
          defending: p.defending,
          dribbling: p.dribbling,
          physical: p.physical
        }
      }));

      const club: Club = {
        id: clubData.id,
        name: clubData.name,
        reputation: clubData.reputation,
        budget: clubData.budget,
        league: clubData.league,
        stadium_name: clubData.stadium_name,
        stadium_capacity: clubData.stadium_capacity,
        players: players,
        formation: clubData.formation,
        tactic: clubData.tactic,
        training: (clubData.training_type as TrainingType) || 'physical',
        preTalkType: (clubData.pre_talk_type as PreTalkType) || 'motivational',
        primary_color: clubData.primary_color,
        secondary_color: clubData.secondary_color,
        emblem: clubData.emblem
      };

      return club;
    } catch (error) {
      console.error('Erro ao buscar clube:', error);
      return null;
    }
  }

  static async getAvailableClubs(): Promise<Club[]> {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .lte('reputation', 70);

      if (error) throw error;

      const clubs: Club[] = [];
      for (const clubData of data) {
        const { data: playersData } = await supabase
          .from('players')
          .select('*')
          .eq('club_id', clubData.id);

        const players: Player[] = (playersData || []).map(p => ({
          id: p.id,
          name: p.name,
          position: p.position as 'GK' | 'DEF' | 'MID' | 'ATK',
          age: p.age,
          overall: p.overall,
          potential: p.potential,
          price: p.price,
          salary: p.salary,
          stamina: p.stamina,
          morale: p.morale,
          is_starter: p.is_starter,
          is_substitute: p.is_substitute,
          attributes: {
            pace: p.pace,
            shooting: p.shooting,
            passing: p.passing,
            defending: p.defending,
            dribbling: p.dribbling,
            physical: p.physical
          }
        }));

        clubs.push({
          id: clubData.id,
          name: clubData.name,
          reputation: clubData.reputation,
          budget: clubData.budget,
          league: clubData.league,
          stadium_name: clubData.stadium_name,
          stadium_capacity: clubData.stadium_capacity,
          players: players,
          formation: clubData.formation,
          tactic: clubData.tactic,
          training: clubData.training_type as TrainingType,
          preTalkType: clubData.pre_talk_type as PreTalkType,
          primary_color: clubData.primary_color,
          secondary_color: clubData.secondary_color,
          emblem: clubData.emblem
        });
      }

      return clubs;
    } catch (error) {
      console.error('Erro ao buscar clubes:', error);
      return [];
    }
  }

  static async getAvailableLeagues(): Promise<League[]> {
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          league_participants(count)
        `)
        .eq('status', 'recruiting');

      if (error) throw error;

      return data.map(league => ({
        id: league.id,
        name: league.name,
        season: league.season,
        createdBy: league.created_by,
        inviteCode: league.invite_code,
        maxTeams: league.max_teams,
        currentTeams: Array.isArray(league.league_participants) ? league.league_participants.length : 0,
        currentRound: league.current_round,
        nextMatchDate: league.next_match_date,
        status: league.status as 'recruiting' | 'active' | 'finished'
      }));
    } catch (error) {
      console.error('Erro ao buscar ligas:', error);
      return [];
    }
  }

  static async joinLeague(leagueId: string, clubId: string, managerId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('league_participants')
        .insert({
          league_id: leagueId,
          club_id: clubId,
          manager_id: managerId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao entrar na liga:', error);
      throw error;
    }
  }

  static async updateClubLineup(clubId: string, lineup: string[], substitutes: string[]) {
    try {
      // Resetar todos os jogadores do clube
      await supabase
        .from('players')
        .update({ is_starter: false, is_substitute: false })
        .eq('club_id', clubId);

      // Definir titulares
      if (lineup.length > 0) {
        await supabase
          .from('players')
          .update({ is_starter: true })
          .in('id', lineup);
      }

      // Definir reservas
      if (substitutes.length > 0) {
        await supabase
          .from('players')
          .update({ is_substitute: true })
          .in('id', substitutes);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar escalação:', error);
      return { success: false, error };
    }
  }

  static async updateClubFormation(clubId: string, formation: string, tactic: string) {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ formation, tactic })
        .eq('id', clubId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar formação:', error);
      return { success: false, error };
    }
  }

  static async updateClubTraining(clubId: string, trainingType: string) {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ training_type: trainingType })
        .eq('id', clubId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      return { success: false, error };
    }
  }

  static async updateClubPreTalk(clubId: string, preTalkType: string) {
    try {
      const { error } = await supabase
        .from('clubs')
        .update({ pre_talk_type: preTalkType })
        .eq('id', clubId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar preleção:', error);
      return { success: false, error };
    }
  }

  static async selectClub(userId: string, clubId: string): Promise<void> {
    try {
      // Primeiro buscar ou criar o manager
      const { data: existingManager } = await supabase
        .from('managers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingManager) {
        // Atualizar o clube atual do manager
        const { error } = await supabase
          .from('managers')
          .update({ current_club_id: clubId })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Criar novo manager se não existir
        const { error } = await supabase
          .from('managers')
          .insert({
            user_id: userId,
            name: 'Manager',
            email: 'manager@example.com',
            current_club_id: clubId
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao selecionar clube:', error);
      throw error;
    }
  }

  // Simulação de partidas
  static async simulateMatch(homeTeamId: string, awayTeamId: string, leagueId?: string): Promise<Match> {
    try {
      const homeTeam = await this.getClubById(homeTeamId);
      const awayTeam = await this.getClubById(awayTeamId);

      if (!homeTeam || !awayTeam) {
        throw new Error('Times não encontrados');
      }

      const homeStrength = this.calculateTeamStrength(homeTeam);
      const awayStrength = this.calculateTeamStrength(awayTeam);

      const result = this.generateMatchResult(homeStrength, awayStrength);
      const events = this.generateMatchEvents(result.homeScore, result.awayScore, homeTeam, awayTeam);

      const match: Match = {
        id: `match_${Date.now()}`,
        homeTeam: homeTeam.name,
        awayTeam: awayTeam.name,
        date: new Date().toISOString(),
        status: 'finished',
        score: {
          home: result.homeScore,
          away: result.awayScore
        },
        events: events,
        round: 1,
        leagueId: leagueId || 'friendly'
      };

      if (leagueId && leagueId !== 'friendly') {
        await supabase
          .from('matches')
          .insert({
            id: match.id,
            league_id: leagueId,
            home_team_id: homeTeamId,
            away_team_id: awayTeamId,
            round: 1,
            scheduled_date: new Date().toISOString(),
            status: 'finished',
            home_score: result.homeScore,
            away_score: result.awayScore,
            events: JSON.stringify(events)
          });

        await this.updateLeagueStandings(leagueId, homeTeamId, awayTeamId, result.homeScore, result.awayScore);
      }

      return match;
    } catch (error) {
      console.error('Erro ao simular partida:', error);
      throw error;
    }
  }

  private static calculateTeamStrength(team: Club): number {
    const starters = team.players.filter(p => p.is_starter);
    if (starters.length === 0) return team.reputation;
    
    const avgOverall = starters.reduce((sum, player) => sum + player.overall, 0) / starters.length;
    const morale = starters.reduce((sum, player) => sum + player.morale, 0) / starters.length;
    const stamina = starters.reduce((sum, player) => sum + player.stamina, 0) / starters.length;
    
    return avgOverall + (morale / 10) + (stamina / 20) + (team.reputation / 5);
  }

  private static generateMatchResult(homeStrength: number, awayStrength: number) {
    const homeBias = 1.1; // Vantagem de jogar em casa
    const adjustedHomeStrength = homeStrength * homeBias;
    
    const strengthDiff = adjustedHomeStrength - awayStrength;
    const randomFactor = (Math.random() - 0.5) * 30; // Fator aleatório
    
    const goalProbability = Math.max(0.5, Math.min(4, (adjustedHomeStrength + awayStrength) / 40));
    
    let homeScore = Math.floor(Math.random() * goalProbability);
    let awayScore = Math.floor(Math.random() * goalProbability);
    
    // Ajustar baseado na diferença de força
    if (strengthDiff > 10) {
      homeScore += Math.random() > 0.3 ? 1 : 0;
    } else if (strengthDiff < -10) {
      awayScore += Math.random() > 0.3 ? 1 : 0;
    }
    
    return { homeScore, awayScore };
  }

  private static generateMatchEvents(homeScore: number, awayScore: number, homeTeam: Club, awayTeam: Club): MatchEvent[] {
    const events: MatchEvent[] = [];
    const totalGoals = homeScore + awayScore;
    
    // Gerar eventos de gols
    for (let i = 0; i < totalGoals; i++) {
      const minute = Math.floor(Math.random() * 90) + 1;
      const isHomeGoal = i < homeScore;
      const team = isHomeGoal ? 'home' : 'away';
      const players = isHomeGoal ? homeTeam.players : awayTeam.players;
      const attackers = players.filter(p => p.position === 'ATK' || p.position === 'MID');
      const scorer = attackers[Math.floor(Math.random() * attackers.length)] || players[0];
      
      events.push({
        minute,
        type: 'goal',
        player: scorer.name,
        team,
        description: `Gol de ${scorer.name}!`
      });
    }
    
    // Gerar alguns cartões aleatórios
    const cardProbability = Math.random();
    if (cardProbability > 0.3) {
      const minute = Math.floor(Math.random() * 90) + 1;
      const isHome = Math.random() > 0.5;
      const team = isHome ? 'home' : 'away';
      const players = isHome ? homeTeam.players : awayTeam.players;
      const player = players[Math.floor(Math.random() * players.length)];
      
      events.push({
        minute,
        type: 'card',
        player: player.name,
        team,
        description: `Cartão amarelo para ${player.name}`
      });
    }
    
    return events.sort((a, b) => a.minute - b.minute);
  }

  private static async updateLeagueStandings(leagueId: string, homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) {
    try {
      // Buscar ou criar entradas na classificação
      const { data: standings } = await supabase
        .from('league_standings')
        .select('*')
        .eq('league_id', leagueId)
        .in('club_id', [homeTeamId, awayTeamId]);

      const homeStanding = standings?.find(s => s.club_id === homeTeamId);
      const awayStanding = standings?.find(s => s.club_id === awayTeamId);

      // Calcular pontos
      let homePoints = 0, awayPoints = 0;
      let homeWon = 0, homeDraw = 0, homeLost = 0;
      let awayWon = 0, awayDraw = 0, awayLost = 0;

      if (homeScore > awayScore) {
        homePoints = 3;
        homeWon = 1;
        awayLost = 1;
      } else if (homeScore < awayScore) {
        awayPoints = 3;
        awayWon = 1;
        homeLost = 1;
      } else {
        homePoints = 1;
        awayPoints = 1;
        homeDraw = 1;
        awayDraw = 1;
      }

      // Atualizar classificação do time da casa
      if (homeStanding) {
        await supabase
          .from('league_standings')
          .update({
            played: homeStanding.played + 1,
            won: homeStanding.won + homeWon,
            drawn: homeStanding.drawn + homeDraw,
            lost: homeStanding.lost + homeLost,
            goals_for: homeStanding.goals_for + homeScore,
            goals_against: homeStanding.goals_against + awayScore,
            goal_difference: (homeStanding.goals_for + homeScore) - (homeStanding.goals_against + awayScore),
            points: homeStanding.points + homePoints
          })
          .eq('id', homeStanding.id);
      } else {
        await supabase
          .from('league_standings')
          .insert([{
            league_id: leagueId,
            club_id: homeTeamId,
            position: 1,
            played: 1,
            won: homeWon,
            drawn: homeDraw,
            lost: homeLost,
            goals_for: homeScore,
            goals_against: awayScore,
            goal_difference: homeScore - awayScore,
            points: homePoints
          }]);
      }

      // Atualizar classificação do time visitante
      if (awayStanding) {
        await supabase
          .from('league_standings')
          .update({
            played: awayStanding.played + 1,
            won: awayStanding.won + awayWon,
            drawn: awayStanding.drawn + awayDraw,
            lost: awayStanding.lost + awayLost,
            goals_for: awayStanding.goals_for + awayScore,
            goals_against: awayStanding.goals_against + homeScore,
            goal_difference: (awayStanding.goals_for + awayScore) - (awayStanding.goals_against + homeScore),
            points: awayStanding.points + awayPoints
          })
          .eq('id', awayStanding.id);
      } else {
        await supabase
          .from('league_standings')
          .insert([{
            league_id: leagueId,
            club_id: awayTeamId,
            position: 1,
            played: 1,
            won: awayWon,
            drawn: awayDraw,
            lost: awayLost,
            goals_for: awayScore,
            goals_against: homeScore,
            goal_difference: awayScore - homeScore,
            points: awayPoints
          }]);
      }

      // Recalcular posições
      await this.recalculateStandingsPositions(leagueId);
    } catch (error) {
      console.error('Erro ao atualizar classificação:', error);
    }
  }

  private static async recalculateStandingsPositions(leagueId: string) {
    try {
      const { data: standings } = await supabase
        .from('league_standings')
        .select('*')
        .eq('league_id', leagueId)
        .order('points', { ascending: false })
        .order('goal_difference', { ascending: false })
        .order('goals_for', { ascending: false });

      if (!standings) return;

      for (let i = 0; i < standings.length; i++) {
        await supabase
          .from('league_standings')
          .update({ position: i + 1 })
          .eq('id', standings[i].id);
      }
    } catch (error) {
      console.error('Erro ao recalcular posições:', error);
    }
  }

  static async getLeagueStandings(leagueId: string): Promise<LeagueTable[]> {
    try {
      const { data: standings } = await supabase
        .from('league_standings')
        .select(`
          *,
          clubs!inner(name)
        `)
        .eq('league_id', leagueId)
        .order('position');

      if (!standings) return [];

      return standings.map(s => ({
        position: s.position,
        team: s.clubs.name,
        played: s.played,
        won: s.won,
        drawn: s.drawn,
        lost: s.lost,
        goalsFor: s.goals_for,
        goalsAgainst: s.goals_against,
        goalDifference: s.goal_difference,
        points: s.points
      }));
    } catch (error) {
      console.error('Erro ao buscar classificação:', error);
      return [];
    }
  }
}
