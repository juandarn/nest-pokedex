import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-responde.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed(cantidad: number) {
    const data = await this.http.get<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${cantidad}`,
    );

    const insertPromisesArray: { name; no }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      const pokemonData = { name, no };

      insertPromisesArray.push(pokemonData);
    });

    await this.pokemonModel.insertMany(insertPromisesArray);

    return 'Seed executed';
  }
}
