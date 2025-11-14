# CreatireBreeding

A simple creature breeding simulation system that allows you to create creatures with unique traits and breed them to produce offspring with inherited characteristics.

## Features

- Create creatures with customizable attributes (species, color, size, strength, intelligence)
- Breed two creatures to produce offspring
- Genetic trait inheritance system
- Random mutations during breeding
- Display creature information and family trees

## Installation

No external dependencies required - uses Python 3.6+

## Usage

```python
from creature_breeding import Creature, breed_creatures

# Create parent creatures
parent1 = Creature(name="Dragon", species="Dragon", color="Red", size=10, strength=8, intelligence=7)
parent2 = Creature(name="Drake", species="Dragon", color="Blue", size=9, strength=7, intelligence=8)

# Breed creatures
offspring = breed_creatures(parent1, parent2)

# Display offspring information
print(offspring)
```

## Running the Demo

```bash
python demo.py
```

## Project Structure

- `creature_breeding.py` - Core creature and breeding logic
- `demo.py` - Example usage and demonstration
- `README.md` - This file

## How Breeding Works

1. Offspring inherits traits from both parents
2. Each trait has a 50% chance of coming from either parent
3. Small random mutations can occur (±10% variation)
4. Offspring name is generated from parent names
5. Species is inherited from parents (must be same species to breed)

## License

MIT License