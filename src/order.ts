import type { CandleUnitOne, Heikinashi, MarketCodeResponse, TickerResponse } from "./interfaces";

export class Upbit {
        private myTargets: Array<string> = [];
        constructor() {}

        private async request<T>(url: string): Promise<T> {
                const response = await fetch(url, { headers: { accept: "application/json" } });
                const result = await response.json();
                return result as T;
        }

        async getMarketCodeKRW() {
                const url = `https://api.upbit.com/v1/market/all?isDetails=false`;
                const result = await this.request<MarketCodeResponse>(url);
                const korResult = result.filter((v) => v.market.startsWith("KRW"));
                return korResult;
        }

        async getCandleOne(code: string) {
                const url = `https://api.upbit.com/v1/candles/minutes/1?market=${code}&count=200`;
                const result = await this.request<Array<CandleUnitOne>>(url);
                return result;
        }

        async getTicker(code: string) {
                const url = `https://api.upbit.com/v1/ticker?markets=${code}`;
                const result = await this.request<[TickerResponse]>(url);
                return result[0];
        }

        async getMyTarget() {
                let index = 1;
                const codes = (await this.getMarketCodeKRW()).map((v) => v.market);
                await codes.reduce(async (prev: Promise<any>, code: string) => {
                        await prev;
                        const result = await this.getTicker(code);
                        if (result.trade_price <= 2000) {
                                console.log(`target ${index++}: ${code}`);
                                this.myTargets.push(code);
                        }
                        await Bun.sleep(300);
                        return result;
                }, Promise.resolve());

                return this.myTargets;
        }

        async getHeikinashi(code: string) {
                const candleData = await this.getCandleOne(code);
                const patterns: any = [];
                for (let i = 1; i < candleData.length; i++) {
                        const prev = candleData[i - 1];
                        const now = candleData[i];

                        const open = (prev.opening_price + prev.trade_price) / 2;
                        const close = (now.opening_price + now.high_price + now.low_price + now.trade_price) / 4;
                        const high = Math.max(now.high_price, open, close);
                        const low = Math.min(now.low_price, open, close);
                        const barTop = Math.max(open, close);
                        const barBottom = Math.min(open, close);
                        const barSize = barTop - barBottom;
                        const head = high;
                        const headSize = high - barTop;
                        const tail = low;
                        const tailSize = barBottom - low;

                        const candle = {
                                barTop,
                                barBottom,
                                barSize,
                                head,
                                headSize,
                                tail,
                                tailSize,
                                name: "None",
                        };

                        let name = "None";
                        if (barSize == 0) {
                                name = "Doji"; // Doji가 상승 추세의 상단에 나타나면 숏 포지션을 준비하고, 하락 추세의 하단에서 롱 거래를 시작
                        } else if (barSize > headSize && tailSize > barSize * 1.5) {
                                name = "Hammer"; // 추세 반전 가능성이 매우 높음
                        } else if (barSize * 1.5 < headSize && tailSize * 5 < barSize) {
                                name = "ShootingStar"; // 강세 추세의 상단에 나타나며 곧 하락 반전을 알립니다.
                        } else if (tailSize == headSize) {
                                name = "HighWave"; //  균형을 나타내며 추세 움직임이 끝나가고 있다는 첫 번째 신호
                        }
                        candle.name = name;
                        patterns.push(candle);
                }

                return this.findCross(patterns);
        }

        private findCross(data: Array<Heikinashi>) {
                // 트렌드의 끝과 새로운 트렌드의 시작을 결정하는 데 도움
                for (let i = 1; i < data.length; i++) {
                        if (data[i - 1].barSize > data[i].head - data[i].tail) {
                                data[i].isCross = true;
                        } else {
                                data[i].isCross = false;
                        }
                }
                return data;
        }
}
