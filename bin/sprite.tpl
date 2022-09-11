export default {
  size: [{{config.imageWidth}}, {{config.imageHeight}}],
  margin: 1,
  frames: {
{{#rects}}
    {{{name}}}: [{{frame.x}}, {{frame.y}}, {{frame.w}}, {{frame.h}}]{{^last}},{{/last}}
{{/rects}}
  }
}
