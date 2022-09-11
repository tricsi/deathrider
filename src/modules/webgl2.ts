const buffers = new Map<string, WebGLBuffer>()

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    return shader
}

export function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    return program
}

export function createTexture(gl: WebGL2RenderingContext, image?: HTMLImageElement, pixelate = true): WebGLTexture {
    const target = gl.TEXTURE_2D
    const texture = gl.createTexture()
    gl.bindTexture(target, texture)
    gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, pixelate ? gl.NEAREST : gl.LINEAR)
    gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    return texture
}

export function bindBuffer(gl: WebGL2RenderingContext, name: string, data?: Float32Array | Uint16Array, type = gl.ARRAY_BUFFER) {
    buffers.has(name) || buffers.set(name, gl.createBuffer())
    gl.bindBuffer(type, buffers.get(name))
    data && gl.bufferData(type, data, gl.STATIC_DRAW)
}

export function setUniform(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, value: number | Float32Array, size?: number) {
    const location = gl.getUniformLocation(program, name)
    if (typeof value == "number") {
        gl.uniform1f(location, value)
    } else switch (size || value.length) {
        case 2: gl.uniform2fv(location, value); break
        case 3: gl.uniform3fv(location, value); break
        case 4: gl.uniform4fv(location, value); break
        case 9: gl.uniformMatrix3fv(location, false, value); break
        case 16: gl.uniformMatrix4fv(location, false, value); break
    }
}

export function setAttribute(gl: WebGL2RenderingContext, program: WebGLProgram, name: string, size: number) {
    const location = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
}
