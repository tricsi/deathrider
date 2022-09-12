import "./modules/input/keyboard"
import "./modules/input/pointer"
import { createContext, renderContext } from "./modules/2d/context"
import { schedule, update } from "./modules/scheduler"
import { physics } from "./core/2d/Poly2D"
import { Loader } from "./game/scene/Loader"
import { on } from "./modules/event"
import { Node } from "./core/Node"
import { doc, fs, mobile } from "./modules/utils"
import { STATE } from "./config"

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
    on("click keydown", () => mobile && fs(), doc);
    scenes.add(new Loader)
    update()
})

//@ts-ignore
doc.monetization && on(doc.monetization, "monetizationstart", () => STATE.life = 1);
