# Lotes de ampliación

Esta carpeta está preparada para añadir nuevas curiosidades por bloques.

Formato recomendado para cada lote:

```json
[
  {
    "category": "historia",
    "text": "Una frase breve, amable y verificable.",
    "tone": "curioso",
    "safe": true,
    "source": "verificable"
  }
]
```

También se puede usar JSON agrupado por categorías o JSONL con un item por línea.

Después de crear un lote:

```powershell
python scripts\merge_facts_batch data\facts\batches\nuevo_lote.json
python scripts\validate_facts --strict-minimum
```

El mezclador genera IDs nuevos al final de cada categoría y el validador actualiza `facts.jsonl` y `report.md`.
