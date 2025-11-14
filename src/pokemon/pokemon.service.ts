import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const pokemons: Pokemon[] = await this.pokemonModel.find();

    return pokemons;
  }

  async findOne(valor: string) {
    let pokemon;
    if (!isNaN(+valor)) {
      pokemon = await this.pokemonModel.findOne({ no: +valor });
    } else if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: valor.toLowerCase().trim(),
      });
    } else if (isValidObjectId(valor)) {
      pokemon = await this.pokemonModel.findById(valor);
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or id ${valor} not found`,
      );
    }

    return pokemon;
  }

  async update(valor: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(valor);

      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto, { new: true });

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(value: string) {
    try {
      const { deletedCount } = await this.pokemonModel.deleteOne({
        _id: value,
      });

      if (deletedCount === 0)
        throw new BadRequestException(`Pokemon with ${value} not found`);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async removeAll(){
    await this.pokemonModel.deleteMany({})
  }

  // Don't repeat yourself
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(error);
  }
}
