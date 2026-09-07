# CMS Home Multimedia System

## Goal
Explain how the shared multimedia form and preview work together.

## Shared components
- `UniversalMultimediaForm`
- `UniversalMultimediaPreview`

## Supported modes
The multimedia system supports 3 modes:
- image
- video
- color

## How the form works
`UniversalMultimediaForm` controls the active mode and the related fields.
It can be used in two ways:
1. With direct section image/video fields
2. With a content-level multimedia block using `contentMediaKey`

## Cached data behavior
The multimedia object keeps cached data for each mode:
- `imageData`
- `videoData`

This allows switching between image, video, and color without losing previously entered values.

## How the preview works
`UniversalMultimediaPreview` reads the same multimedia structure and renders the correct visual output.
It supports:
- background mode
- inline mode
- fallback image
- fallback video
- fallback color
- layout sizing through class names

## Rule
The form and preview must read from the same multimedia shape.
If the form stores image data, the preview should be able to render it immediately.

## Used by
This system is now wired into the Home CMS sections that need reusable multimedia handling.
