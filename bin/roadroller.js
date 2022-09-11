import { Packer } from 'roadroller'

export default function roadroller(config = {}) {
    if (config.pass) {
        return
    }
    return {
        name: 'rollup-plugin-roadroller',
        renderChunk: async (code) => {
            const packer = new Packer([{
                data: code,
                type: 'js',
                action: 'eval',
            }], config)
            await packer.optimize()
            const { firstLine, secondLine } = packer.makeDecoder()
            return `${firstLine}\n${secondLine}`
        }
    }
}
