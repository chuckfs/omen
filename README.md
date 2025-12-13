# Omen

**A generative symbolic interpretation tool for exploring the many meanings of signs and symbols.**

[Live Demo](https://omen-lyart.vercel.app) · [Report Bug](https://github.com/chuckfs/omen/issues) · [Request Feature](https://github.com/chuckfs/omen/issues)

</div>

---

## What Omen Is

Omen generates multi-perspective interpretations of symbols—animals, weather phenomena, numbers, colors, dreams, and other signs—using AI. Rather than retrieving fixed definitions from a database, Omen synthesizes interpretations at query time across three lenses:

- **Folkloric & Traditional** — Mythological, spiritual, and folk meanings across cultures
- **Cultural** — Modern societal associations and contemporary significance  
- **Psychological** — Jungian archetypes, subconscious symbolism, and dream interpretation

Users can personalize their experience by providing location context and selecting a spiritual or philosophical background, which shapes how interpretations are framed.

## What Omen Is Not

Omen is **not** a spiritual authority, cultural encyclopedia, or factual reference. 

All interpretations are AI-generated and reflect patterns in the model's training data—not verified scholarly sources or authentic cultural knowledge. The folkloric interpretations in particular should not be mistaken for genuine Indigenous, religious, or regional wisdom. For authentic cultural understanding, consult primary sources and community voices.

Omen is designed for **personal reflection and curiosity**, not guidance or decision-making.

## Design Philosophy

### Generative-First Architecture

Unlike retrieval-augmented systems that look up pre-written answers, Omen generates interpretations fresh for each query. This is an intentional design choice: symbolic meaning isn't a fact-retrieval problem. There's no single correct answer to "what does a crow mean?" The generative approach allows for contextual personalization and acknowledges that meaning is constructed, not discovered.

### Pluralism Over Authority

By presenting three distinct interpretive lenses, Omen avoids flattening meaning into a single "correct" answer. Users control which lenses they see. Disagreement between perspectives is a feature, not a bug—it reflects the genuine complexity of symbolic interpretation.

### Evolving, Not Static

Omen stores your interpreted symbols locally, building a personal collection over time. Future development will focus on versioning, comparison, and tracking how interpretations shift with context. The long-term vision is a fluid knowledge base that grows and adapts through use.

## Features

- 🔮 **Multi-lens interpretations** — Folkloric, cultural, and psychological perspectives for each symbol
- 📍 **Location awareness** — Optional geolocation to contextualize regional folklore
- 🕯️ **Spiritual personalization** — Tailor interpretations to your background or practice
- ⭐ **Favorites & history** — Save meaningful interpretations and revisit past queries
- 🌓 **Light/dark/system themes** — Comfortable viewing in any environment
- 📤 **Share functionality** — Export interpretations to share with others
- 💾 **Local persistence** — Your data stays in your browser, per-user

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind-style utility CSS
- **Backend:** Vercel Serverless Functions
- **AI Model:** Mistral 7B Instruct (via HuggingFace Inference API)
- **Storage:** Browser localStorage (per-user)

## Project Structure

```
omen/
├── api/
│   └── omen.ts              # Vercel serverless function for AI generation
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SymbolDisplay.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── ProfilePage.tsx
│   │   └── OmenGrid.tsx
│   ├── hooks/
│   │   └── useLocalOmenStorage.ts  # Local persistence logic
│   ├── services/
│   │   └── geminiService.ts        # API client
│   ├── utils/
│   │   └── textUtils.ts
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Main application
│   └── index.tsx            # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- A [HuggingFace](https://huggingface.co/) account and API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/omen.git
   cd omen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   HF_API_KEY=your_huggingface_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Deployment

Omen is configured for Vercel deployment:

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add `HF_API_KEY` to your Vercel environment variables
4. Deploy

The `api/omen.ts` file automatically becomes a serverless function at `/api/omen`.

## Current Limitations

- **No grounding against sources** — Interpretations are synthesized, not verified against folklore databases or academic references
- **Western-centric training data** — The underlying model overrepresents English-language and Western sources
- **Location context is approximate** — The model cannot reliably map coordinates to specific cultural regions
- **No shared knowledge base** — Each user's interpretations are isolated in their browser
- **No versioning** — Re-querying a symbol overwrites the previous interpretation

These limitations are acknowledged, not hidden. Addressing them is part of the long-term roadmap.

## Ethical Considerations

### AI-Generated Content

Every interpretation displayed by Omen is generated by an AI language model. These outputs:
- Reflect patterns in training data, not objective truth
- May contain inaccuracies, inventions, or cultural misrepresentations
- Should not be treated as authoritative spiritual, religious, or cultural guidance

### Cultural Sensitivity

The "Folkloric & Traditional" interpretations synthesize information from the model's training corpus, which does not equally represent all cultures. These interpretations:
- Do not represent the views of any specific cultural community
- Should not be mistaken for authentic Indigenous or traditional knowledge
- May inadvertently perpetuate Western framings of non-Western symbols

For genuine cultural understanding, seek out primary sources and voices from the relevant communities.

### What This System Cannot Provide

- Spiritual guidance or prophecy
- Accurate representation of specific cultural traditions
- Medical, psychological, or life advice
- Factually verified historical information

## Roadmap

- [ ] Rename "indigenous" category to "folkloric/traditional" throughout codebase
- [ ] Add visible AI-generation disclaimer in the UI
- [ ] Implement interpretation metadata (timestamp, model version, context)
- [ ] Query normalization to reduce symbol fragmentation
- [ ] Support multiple interpretations per symbol (append, don't overwrite)
- [ ] Server-side persistence option
- [ ] Interpretation history and comparison view
- [ ] Confidence/groundedness indicators

## Contributing

This is a personal portfolio project, but thoughtful contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure any contributions align with the project's ethical considerations.

## License

[MIT](LICENSE)

## Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- AI generation powered by [Mistral AI](https://mistral.ai/) via [HuggingFace](https://huggingface.co/)
- Deployed on [Vercel](https://vercel.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

<div align="center">

**Omen is a student portfolio project exploring ethical AI meaning synthesis.**

*Interpretations are generated, not retrieved. Perspectives are plural, not authoritative. Meaning is explored, not declared.*

</div>
