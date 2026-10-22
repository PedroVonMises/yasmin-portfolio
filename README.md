# Yasmin — portfolio audiovisual

Static site (Vite, vanilla JS). Its layout follows the design notes in `docs/design-reference.md`. All of the text and media are Yasmin's.

## Filling in the content
1. Put photos/videos in `public/media/` (e.g. `public/media/hero-1.jpg`).
2. Edit `src/content.json`:
   - Replace every `[[PREENCHER]]`.
   - `image`: `"/media/hero-1.jpg"`. Leave it `null` to show a grey placeholder.
   - `video` / `url`: a YouTube or Vimeo link, or an `.mp4` path. It opens in a lightbox.
   - `director.reel`: an `.mp4` for the full-width autoplay banner.
3. Find anything still missing with `grep -n PREENCHER src/content.json`.

## Commands
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
npm run preview  # serves dist/
```

Pages: `index.html` (one-page: hero, sobre, filmmaker, galeria, creator, campanhas, diretora), `filmmaker.html`, `galeria.html`, `contato.html`.
