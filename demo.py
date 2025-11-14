#!/usr/bin/env python3
"""
Creature Breeding Demo

Demonstrates the creature breeding system with various examples.
"""

from creature_breeding import Creature, breed_creatures, display_family_tree


def main():
    print("=" * 60)
    print("CREATURE BREEDING SYSTEM DEMO")
    print("=" * 60)
    print()
    
    # Example 1: Basic breeding
    print("Example 1: Basic Dragon Breeding")
    print("-" * 60)
    
    dragon1 = Creature(
        name="Ember",
        species="Dragon",
        color="Red",
        size=9,
        strength=8,
        intelligence=6
    )
    
    dragon2 = Creature(
        name="Frost",
        species="Dragon",
        color="Blue",
        size=8,
        strength=7,
        intelligence=8
    )
    
    print("Parent 1:")
    print(dragon1)
    print()
    
    print("Parent 2:")
    print(dragon2)
    print()
    
    offspring1 = breed_creatures(dragon1, dragon2)
    print("Offspring:")
    print(offspring1)
    print()
    print()
    
    # Example 2: Multiple generations
    print("Example 2: Multi-Generation Breeding")
    print("-" * 60)
    
    phoenix1 = Creature(
        name="Blaze",
        species="Phoenix",
        color="Red",
        size=7,
        strength=6,
        intelligence=9
    )
    
    phoenix2 = Creature(
        name="Solar",
        species="Phoenix",
        color="Yellow",
        size=6,
        strength=5,
        intelligence=9
    )
    
    print("Generation 1 Parents:")
    print(f"  {phoenix1.name} - {phoenix1.species}")
    print(f"  {phoenix2.name} - {phoenix2.species}")
    print()
    
    gen2_offspring = breed_creatures(phoenix1, phoenix2)
    print(f"Generation 2: {gen2_offspring.name}")
    print(f"  Color: {gen2_offspring.color}")
    print(f"  Stats: Size={gen2_offspring.size}, Str={gen2_offspring.strength}, Int={gen2_offspring.intelligence}")
    print()
    
    # Breed another generation 1
    phoenix3 = Creature(
        name="Pyra",
        species="Phoenix",
        color="Red",
        size=8,
        strength=7,
        intelligence=8
    )
    
    gen2_offspring2 = breed_creatures(phoenix2, phoenix3)
    print(f"Generation 2 (second): {gen2_offspring2.name}")
    print(f"  Color: {gen2_offspring2.color}")
    print(f"  Stats: Size={gen2_offspring2.size}, Str={gen2_offspring2.strength}, Int={gen2_offspring2.intelligence}")
    print()
    
    # Now breed generation 2 together
    gen3_offspring = breed_creatures(gen2_offspring, gen2_offspring2)
    print(f"Generation 3: {gen3_offspring.name}")
    print(f"  Color: {gen3_offspring.color}")
    print(f"  Stats: Size={gen3_offspring.size}, Str={gen3_offspring.strength}, Int={gen3_offspring.intelligence}")
    print()
    
    # Display family tree
    print("Family Tree of Generation 3:")
    display_family_tree(gen3_offspring)
    print()
    print()
    
    # Example 3: Different species (error handling)
    print("Example 3: Attempting to Breed Different Species")
    print("-" * 60)
    
    unicorn = Creature(
        name="Sparkle",
        species="Unicorn",
        color="White",
        size=7,
        strength=5,
        intelligence=9
    )
    
    try:
        invalid_offspring = breed_creatures(dragon1, unicorn)
    except ValueError as e:
        print(f"Error: {e}")
        print("✓ Correctly prevented breeding of different species")
    print()
    print()
    
    # Example 4: Creating a diverse population
    print("Example 4: Building a Creature Population")
    print("-" * 60)
    
    creatures = [
        Creature("Thunder", "Griffin", "Gold", 8, 8, 7),
        Creature("Storm", "Griffin", "Silver", 7, 9, 6),
        Creature("Azure", "Griffin", "Blue", 9, 7, 8),
    ]
    
    print("Initial Population:")
    for creature in creatures:
        print(f"  {creature.name} ({creature.color} {creature.species})")
    print()
    
    # Breed pairs
    offspring_a = breed_creatures(creatures[0], creatures[1])
    offspring_b = breed_creatures(creatures[1], creatures[2])
    offspring_c = breed_creatures(offspring_a, offspring_b)
    
    print("New Generation:")
    print(f"  {offspring_a.name} (Gen {offspring_a.generation})")
    print(f"  {offspring_b.name} (Gen {offspring_b.generation})")
    print(f"  {offspring_c.name} (Gen {offspring_c.generation})")
    print()
    
    print("Final Creature Details:")
    print(offspring_c)
    print()
    
    print("=" * 60)
    print("DEMO COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
