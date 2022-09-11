import "./modules/input/keyboard"
import "./modules/input/pointer"
import { createContext, renderContext } from "./modules/2d/context"
import { schedule, update } from "./modules/scheduler"
import { physics } from "./core/2d/Poly2D"
import { Loader } from "./game/scene/Loader"
import { on } from "./modules/event"
import { Game } from "./game/scene/Game"
import { Node } from "./core/Node"
import { fs, mobile } from "./modules/utils"

const scenes = new Node

schedule(delta => {
    physics(scenes)
    scenes.update(delta)
}, 0, 60)

schedule(() => {
    scenes.render()
    renderContext()
}, 9)

createContext(() => {
    scenes.add(new Loader)
    on("ready", () => scenes.add(new Game))
    on("click keydown", () => mobile && fs(), document);
    update()
})
