import type { TickerResponseWS } from "./interfaces";
import { Upbit } from "./order";
import { TokenManager } from "./tokenManager";
import { WebSocket } from "ws";

type Heikinashi = {
        prev_open: number;
        prev_close: number;
        candles: Array<HCandle>;
        prev_timestamp: number;
};

type HCandle = {
        barTop: number;
        barBottom: number;
        barSize: number;
        head: number;
        headSize: number;
        tail: number;
        tailSize: number;
};

export class Price {
        private token: string;
        private ws: WebSocket | undefined;
        private heikinashiMap: Map<string, Heikinashi> = new Map();

        constructor() {
                this.token = TokenManager.getInstance().getJWT();

                this.initWs();
        }

        initWs() {
                this.ws = new WebSocket("wss://api.upbit.com/websocket/v1", {
                        headers: {
                                authorization: `Bearer ${this.token}`,
                        },
                });

                this.ws.onopen = () => {
                        console.log("socket connected!");
                };

                this.ws.onerror = (err) => {
                        console.error(err);
                        this.ws?.terminate();
                };

                this.ws.onclose = () => {
                        console.log("socket connected!");
                        setTimeout(() => {
                                this.ws = undefined;
                                this.initWs();
                        }, 2000);
                };

                this.ws.onmessage = (message) => {
                        const resp = JSON.parse(message.data.toString());
                        if (resp.type == "ticker") {
                                this.makeHeikinashi(resp);
                        }
                };
        }

        private send(data: any) {
                this.ws?.send(JSON.stringify(data));
        }

        public getTicker(codes: Array<string>) {
                const message = [
                        { ticket: crypto.randomUUID() },
                        {
                                type: "ticker",
                                codes: codes,
                        },
                ];
                this.send(message);
        }

        private makeHeikinashi(data: TickerResponseWS) {
                console.log(data);
                const { code, opening_price, high_price, low_price, timestamp, trade_price } = data;
                const cutTimeStamp = Math.floor(timestamp / 1000);
                if (this.heikinashiMap.has(data.code)) {
                        const prevPrice = this.heikinashiMap.get(code) as Heikinashi;
                        const { prev_open, prev_close, candles, prev_timestamp } = prevPrice;

                        if (cutTimeStamp <= prev_timestamp) return;
                        const close = (opening_price + high_price + low_price + trade_price) / 4;
                        const open = (prev_close + prev_open) / 2;
                        const high = Math.max(high_price, opening_price, trade_price);
                        const low = Math.min(low_price, opening_price, trade_price);

                        const candle = this.getCandle({ close, open, high, low });

                        candles.push(candle);
                        // console.log({ ...candle, opening_price, high_price, low_price, timestamp, trade_price });
                        const newTicker: Heikinashi = {
                                prev_open: data.opening_price,
                                prev_close: data.trade_price,
                                candles,
                                prev_timestamp: cutTimeStamp,
                        };
                        this.heikinashiMap.set(code, newTicker);
                } else {
                        const newTicker: Heikinashi = {
                                prev_open: opening_price,
                                prev_close: trade_price,
                                candles: [],
                                prev_timestamp: cutTimeStamp,
                        };
                        this.heikinashiMap.set(code, newTicker);
                }
        }

        private getCandle(params: { close: number; open: number; high: number; low: number }): HCandle {
                const { close, open, high, low } = params;
                const barTop = Math.max(open, close);
                const barBottom = Math.min(open, close);
                const barSize = barTop - barBottom;
                const head = high;
                const headSize = high - barTop;
                const tail = low;
                const tailSize = barBottom - low;

                const candle: HCandle = {
                        barTop,
                        barBottom,
                        barSize,
                        head,
                        headSize,
                        tail,
                        tailSize,
                };
                return candle;
        }
}
