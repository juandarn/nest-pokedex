import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

// Expresa que tiene todas las propiedades de la entity
// pero se setean como opcionales
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
