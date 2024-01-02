import { Price } from "./price";
import { Upbit } from "./order";

(async () => {
        const price = new Price();
        const order = new Upbit();
        // const myTargets = await order.getMyTarget();
        // console.log(myTargets);
        await Bun.sleep(2000);
        price.getTicker(["KRW-SEI"]);
        // const result = await order.getHeikinashi("KRW-SEI");

        // console.log(result);

        // await Bun.write("smaple.json", JSON.stringify(result));
})();
