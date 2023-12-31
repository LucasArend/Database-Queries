import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
      const games = await this.repository
      .createQueryBuilder('games')
      .where('games.title ILIKE :param', { param: `%${param}%` })
      .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .where('game.id = :id', { id })
      .relation(Game, 'users')
      .of(id)
      .loadMany();

    return games
      
  }
}
