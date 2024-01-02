type MarketCodeInfo = {
        market: string;
        korean_name: string;
        english_name: string;
};
export type MarketCodeResponse = Array<MarketCodeInfo>;

export type TickerResponse = {
        market: string;
        trade_date: string;
        trade_time: string;
        trade_date_kst: string;
        trade_time_kst: string;
        trade_timestamp: number;
        opening_price: number;
        high_price: number;
        low_price: number;
        trade_price: number;
        prev_closing_price: number;
        change: string;
        change_price: number;
        signed_change_price: number;
        signed_change_rate: number;
        trade_volume: number;
        acc_trade_price: number;
        acc_trade_price_24h: number;
        acc_trade_volume: number;
        acc_trade_volume_24h: number;
        highest_52_week_price: number;
        highest_52_week_date: string;
        lowest_52_week_price: number;
        lowest_52_week_date: string;
        timestamp: number;
};

export type TickerResponseWS = {
        type: string;
        code: string;
        opening_price: number;
        high_price: number;
        low_price: number;
        trade_price: number;
        prev_closing_price: number;
        acc_trade_price: number;
        change: string;
        change_price: number;
        signed_change_price: number;
        change_rate: number;
        signed_change_rate: number;
        ask_bid: string;
        trade_volume: string;
        acc_trade_volume: string;
        trade_date: string;
        trade_time: string;
        trade_timestamp: number;
        acc_ask_volume: number;
        acc_bid_volume: number;
        highest_52_week_price: number;
        highest_52_week_date: string;
        lowest_52_week_price: number;
        lowest_52_week_date: string;
        market_state: string;
        is_trading_suspended: boolean;
        delisting_date: any;
        market_warning: string;
        timestamp: number;
        acc_trade_price_24h: number;
        acc_trade_volume_24h: number;
        stream_type: string;
};

export type CandleUnitOne = {
        market: string;
        candle_date_time_utc: string;
        candle_date_time_kst: string;
        opening_price: number;
        high_price: number;
        low_price: number;
        trade_price: number;
        timestamp: number;
        candle_acc_trade_price: number;
        candle_acc_trade_volume: number;
        unit: number;
};

export type Heikinashi = {
        barTop: number;
        barBottom: number;
        barSize: number;
        head: number;
        headSize: number;
        tail: number;
        tailSize: number;
        name?: string;
        isCross?: boolean;
};
