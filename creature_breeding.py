"""
Creature Breeding System

A simple system for creating and breeding creatures with inheritable traits.
"""

import random
from typing import Optional


class Creature:
    """
    Represents a creature with various attributes and traits.
    
    Attributes:
        name (str): The creature's name
        species (str): The creature's species
        color (str): The creature's color
        size (int): Size rating (1-10)
        strength (int): Strength rating (1-10)
        intelligence (int): Intelligence rating (1-10)
        generation (int): Which generation this creature belongs to
        parents (tuple): Reference to parent creatures (if any)
    """
    
    def __init__(self, name: str, species: str, color: str, 
                 size: int, strength: int, intelligence: int,
                 generation: int = 1, parents: Optional[tuple] = None):
        self.name = name
        self.species = species
        self.color = color
        self.size = max(1, min(10, size))  # Clamp between 1-10
        self.strength = max(1, min(10, strength))
        self.intelligence = max(1, min(10, intelligence))
        self.generation = generation
        self.parents = parents
    
    def __str__(self):
        parent_info = ""
        if self.parents:
            parent_info = f"\n  Parents: {self.parents[0].name} & {self.parents[1].name}"
        
        return (f"Creature: {self.name}\n"
                f"  Species: {self.species}\n"
                f"  Color: {self.color}\n"
                f"  Size: {self.size}/10\n"
                f"  Strength: {self.strength}/10\n"
                f"  Intelligence: {self.intelligence}/10\n"
                f"  Generation: {self.generation}"
                f"{parent_info}")
    
    def __repr__(self):
        return f"Creature(name='{self.name}', species='{self.species}', generation={self.generation})"
    
    def get_stats(self):
        """Returns a dictionary of the creature's stats."""
        return {
            'name': self.name,
            'species': self.species,
            'color': self.color,
            'size': self.size,
            'strength': self.strength,
            'intelligence': self.intelligence,
            'generation': self.generation
        }


def breed_creatures(parent1: Creature, parent2: Creature) -> Creature:
    """
    Breeds two creatures to produce an offspring.
    
    The offspring inherits traits from both parents with some random variation.
    Parents must be of the same species.
    
    Args:
        parent1: First parent creature
        parent2: Second parent creature
    
    Returns:
        A new Creature instance representing the offspring
    
    Raises:
        ValueError: If parents are not the same species
    """
    if parent1.species != parent2.species:
        raise ValueError(f"Cannot breed different species: {parent1.species} and {parent2.species}")
    
    # Generate offspring name from parent names
    offspring_name = _generate_offspring_name(parent1.name, parent2.name)
    
    # Inherit species from parents
    offspring_species = parent1.species
    
    # Inherit or blend color
    offspring_color = _inherit_color(parent1.color, parent2.color)
    
    # Inherit numeric traits with variation
    offspring_size = _inherit_trait(parent1.size, parent2.size)
    offspring_strength = _inherit_trait(parent1.strength, parent2.strength)
    offspring_intelligence = _inherit_trait(parent1.intelligence, parent2.intelligence)
    
    # Determine generation
    offspring_generation = max(parent1.generation, parent2.generation) + 1
    
    # Create offspring
    offspring = Creature(
        name=offspring_name,
        species=offspring_species,
        color=offspring_color,
        size=offspring_size,
        strength=offspring_strength,
        intelligence=offspring_intelligence,
        generation=offspring_generation,
        parents=(parent1, parent2)
    )
    
    return offspring


def _generate_offspring_name(name1: str, name2: str) -> str:
    """
    Generates a name for offspring by combining parent names.
    
    Takes parts from each parent's name to create a new unique name.
    """
    # Try to create a blend of the two names
    if len(name1) >= 3 and len(name2) >= 3:
        # Take first part of first name and last part of second name
        part1 = name1[:len(name1)//2]
        part2 = name2[len(name2)//2:]
        return part1 + part2
    else:
        # For short names, just concatenate with a suffix
        return f"{name1}{name2}Jr"


def _inherit_color(color1: str, color2: str) -> str:
    """
    Determines offspring color from parent colors.
    
    50% chance of inheriting from either parent, with a small chance
    of color blending for certain combinations.
    """
    # Color blending rules
    color_blends = {
        ('Red', 'Blue'): 'Purple',
        ('Blue', 'Red'): 'Purple',
        ('Red', 'Yellow'): 'Orange',
        ('Yellow', 'Red'): 'Orange',
        ('Blue', 'Yellow'): 'Green',
        ('Yellow', 'Blue'): 'Green',
    }
    
    # 20% chance of blending if colors can blend
    if random.random() < 0.2 and (color1, color2) in color_blends:
        return color_blends[(color1, color2)]
    
    # Otherwise, inherit from one parent
    return random.choice([color1, color2])


def _inherit_trait(trait1: int, trait2: int) -> int:
    """
    Determines offspring trait value from parent traits.
    
    Takes the average of parent traits and applies a small random mutation.
    """
    # Average of parent traits
    base_value = (trait1 + trait2) / 2
    
    # Apply small random mutation (-1 to +1)
    mutation = random.uniform(-1, 1)
    
    # Calculate final value and clamp between 1-10
    final_value = round(base_value + mutation)
    return max(1, min(10, final_value))


def display_family_tree(creature: Creature, indent: int = 0) -> None:
    """
    Displays the family tree of a creature, showing its ancestors.
    
    Args:
        creature: The creature whose family tree to display
        indent: Current indentation level (used for recursion)
    """
    prefix = "  " * indent
    print(f"{prefix}{creature.name} (Gen {creature.generation}, {creature.species})")
    
    if creature.parents:
        print(f"{prefix}├─ Parents:")
        for parent in creature.parents:
            display_family_tree(parent, indent + 1)
