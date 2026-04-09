# Design Brief

## Direction

Lamu Sports Hub — Premium dark sports platform for FKF Lamu County League with bold orange energy grounded by cool blue authority.

## Tone

High-contrast dark modern sports UI with energetic orange accents driving engagement, premium glass-morphism surfaces, and breathing animated background — refined intensity without chaos.

## Differentiation

Animated floating orbs background with glass-morphism chrome (header/nav) featuring orange accent borders creates immersive, premium sports atmosphere.

## Color Palette

| Token      | OKLCH             | Role                         |
|------------|-------------------|------------------------------|
| background| 0.08 0 0          | Deep dark canvas base        |
| foreground| 0.94 0 0          | Light text on dark           |
| card      | 0.13 0 0          | Elevated card surfaces       |
| primary   | 0.58 0.27 24.8    | Orange hero accent, CTAs     |
| secondary | 0.44 0.19 257     | Blue secondary authority     |
| accent    | 0.58 0.27 24.8    | Bright action highlights     |
| destructive| 0.65 0.22 22     | Red pulsing live indicators  |
| muted     | 0.20 0 0          | Subtle secondary text        |

## Typography

- Display: Space Grotesk — hero headings, team names, scores
- Body: DM Sans — descriptions, labels, UI text
- Scale: h1 `text-4xl font-bold`, h2 `text-2xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Glass-effect cards with orange borders on hover, subtle elevation shadows, dark background with animated gradient orbs creating depth layers.

## Structural Zones

| Zone    | Background                | Border                  | Notes                                    |
|---------|---------------------------|-------------------------|------------------------------------------|
| Header  | Glass 0.95 opacity        | Orange accent (0.2 opt) | Fixed top, blur, minimal elevation       |
| Content | Dark background (0.08)    | —                       | Animated float orbs behind content       |
| Nav     | Glass 0.95 opacity        | Orange accent (0.2 opt) | Fixed bottom, blur, 7 tabs               |

## Spacing & Rhythm

Tight vertical rhythm with 0.75rem base radius, 1rem padding on cards, 0.75rem gaps between items, generous horizontal margins on mobile (1rem).

## Component Patterns

- Buttons: Orange background on dark, hover scale + glow, rounded-xl (16px)
- Cards: Dark background, orange border on hover, glass effect overlay, rounded-lg (12px)
- Badges: Position (gold/silver/bronze) or live (red pulse), circular, centered

## Motion

- Entrance: Fade-in 0.3s on section switch
- Hover: Scale 1.02 + orange border lightening on cards, icon lift 0.3s
- Decorative: Float 20s infinite (orbs), pulse-live 2s infinite (match badges), blink 1s (live dots)

## Constraints

- Never use raw hex colors — use OKLCH tokens exclusively
- Orange at 0.58 L 0.27 C 24.8° H for max vibrancy on dark (contrast 0.5+ from background)
- Floating orbs at low opacity (0.05–0.15) to avoid overwhelming content
- Glass effect only on fixed chrome (header, bottom-nav)

## Signature Detail

Glass-morphism borders with subtle orange accent strokes (#FF6B00 at 20% opacity) on fixed navigation chrome paired with breathing animated orbs background — premium sports digital experience.
