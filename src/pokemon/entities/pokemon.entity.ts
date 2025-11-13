import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Le dice a mongo que este es el esquema
// del documento
@Schema()
export class Pokemon extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

// Exportar el esquema
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
