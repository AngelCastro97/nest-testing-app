import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { NotFoundException } from '@nestjs/common';

describe('PokemonsService', () => {
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonsService]
    }).compile()

    service = module.get<PokemonsService>(PokemonsService);
  });

  it('it should be defined', () => {
    expect(service).toBeDefined();
  })

  it('should create pokemon', async() => {
    const pokemon = {
      name: 'Pikachu',
      type: 'Electric'
    }

    const result = await service.create(pokemon)
    expect(result).toBe(`This action adds a ${pokemon.name}`)
  })

  it('should return pokemon if exist', async() => {
    const pokemon = {
      id: 4,
      name: "charmander",
      type: "fire",
      hp: 39,
      sprites: [
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png"
      ]
    }

    const result = await service.findOne(pokemon.id);
    expect(result).toEqual(pokemon)
  })

  it('should return error if pokemon doesnt exist', () => {
    expect(service.findOne(9999999)).rejects.toThrow(NotFoundException)
  })

  it('should check properties of pokemon', async() => {
    const id = 4;
    const pokemon = await service.findOne(id);

    expect(pokemon).toHaveProperty('id');
    expect(pokemon).toHaveProperty('name');

    expect(pokemon).toEqual(
      expect.objectContaining({
        id: id,
        hp: expect.any(Number)
      })
    )
  })

  it('should find all pokemons and cache them', async() => {
    const pokemons = await service.findAll({ limit: 10, page: 1 })
    expect(service.paginatedPokemonsCache.has('10-1')).toBeTruthy()
    expect(service.paginatedPokemonsCache.get('10-1')).toBe(pokemons)
  })
});
