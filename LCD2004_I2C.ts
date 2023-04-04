/**
* makecode I2C LCD2004 package for microbit.
* From microbit/micropython Chinese community.
* http://www.micropython.org.cn
*/

/**
 * Custom blocks
 */
//% weight=20 color=#0fbc11 icon="▀"
namespace I2C_LCD2004 {
    let i2cAddr: number // 0x3F: PCF8574A, 0x27: PCF8574
    let BK: number      // backlight control
    let RS: number      // command/data

    // set LCD reg
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE)
        basic.pause(1)
    }

    // send data to I2C bus
    function set(d: number) {
        d = d & 0xF0
        d = d + BK + RS
        setreg(d)
        setreg(d + 4)
        setreg(d)
    }

    // send command
    function cmd(d: number) {
        RS = 0
        set(d)
        set(d << 4)
    }

    // send data
    function dat(d: number) {
        RS = 1
        set(d)
        set(d << 4)
    }

    // auto get LCD address
    function AutoAddr() {
        let k = true
        let addr = 0x20
        let d1 = 0, d2 = 0
        while (k && (addr < 0x28)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr

        addr = 0x38
        while (k && (addr < 0x40)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE)
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE)
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE)
            if ((d1 == 7) && (d2 == 0)) k = false
            else addr += 1
        }
        if (!k) return addr
        else return 0

    }

    /**
     * initial LCD, set I2C address. Address is 39/63 for PCF8574/PCF8574A
     * @param Addr is i2c address for LCD, eg: 0, 39, 63. 0 is auto find address
     */
    //% blockId="I2C_LCD1620_SET_ADDRESS" block="LCD-Initialisierung mit Adresse %addr"
    //% weight=100 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function LcdInit(Addr: number) {
        if (Addr == 0) i2cAddr = AutoAddr()
        else i2cAddr = Addr
        BK = 8
        RS = 0
        cmd(0x33)       // set 4bit mode
        basic.pause(5)
        set(0x30)
        basic.pause(5)
        set(0x20)
        basic.pause(5)
        cmd(0x28)       // set mode
        cmd(0x0C)
        cmd(0x06)
        cmd(0x01)       // clear
    }

    /**
     * show a number in LCD at given position
     * @param n is number will be show, eg: 10, 100, 200
     * @param x is LCD column position, eg: 0
     * @param y is LCD row position, eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_NUMBER" block="Nummernanzeige %n|bei Position x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=19
    //% y.min=0 y.max=3
    //% parts=LCD2004_I2C trackArgs=0
    export function ShowNumber(n: number, x: number, y: number): void {
        let s = n.toString()
        ShowString(s, x, y)
    }

    /**
     * show a string in LCD at given position
     * @param s is string will be show, eg: "Hello"
     * @param x is LCD column position, [0 - 19], eg: 0
     * @param y is LCD row position, [0 - 3], eg: 0
     */
    //% blockId="I2C_LCD1620_SHOW_STRING" block="Zeichenanzeige %s|bei Position x %x|y %y"
    //% weight=90 blockGap=8
    //% x.min=0 x.max=19
    //% y.min=0 y.max=3
    //% parts=LCD2004_I2C trackArgs=0
    export function ShowString(s: string, x: number, y: number): void {
        let a: number

        if (y == 0)
            a = 0x80
        if (y == 1)
            a = 0xC0
        if (y == 2)
            a = 0x94
        if (y == 3)
            a = 0xD4
                         
        a += x
        cmd(a)

        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i))
            }
    }

    /**
     * LCD-Anzeige einschalten
     */
    //% blockId="I2C_LCD1620_ON" block="LCD-Anzeige einschalten"
    //% weight=81 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function on(): void {
        cmd(0x0C)
    }

    /**
     * LCD-Anzeige ausschalten
     */
    //% blockId="I2C_LCD1620_OFF" block="LCD-Anzeige ausschalten"
    //% weight=80 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function off(): void {
        cmd(0x08)
    }

    /**
     * LCD-Anzeige löschen
     */
    //% blockId="I2C_LCD1620_CLEAR" block="LCD-Anzeige löschen"
    //% weight=85 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function clear(): void {
        cmd(0x01)
    }

    /**
     * Hintergrundbeleuchtung einschalten
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_ON" block="Hintergrundbeleuchtung einschalten"
    //% weight=71 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function BacklightOn(): void {
        BK = 8
        cmd(0)
    }

    /**
     * Hintergrundbeleuchtung ausschalten
     */
    //% blockId="I2C_LCD1620_BACKLIGHT_OFF" block="Hintergrundbeleuchtung ausschalten"
    //% weight=70 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function BacklightOff(): void {
        BK = 0
        cmd(0)
    }

    /**
     * Zeichen nach links bewegen
     */
    //% blockId="I2C_LCD1620_SHL" block="Zeichen nach links bewegen"
    //% weight=61 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function shl(): void {
        cmd(0x18)
    }

    /**
     * Zeichen nach rechts bewegen
     */
    //% blockId="I2C_LCD1620_SHR" block="Zeichen nach rechts bewegen"
    //% weight=60 blockGap=8
    //% parts=LCD2004_I2C trackArgs=0
    export function shr(): void {
        cmd(0x1C)
    }
}