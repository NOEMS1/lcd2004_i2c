Stundenanzeige = ""
Minutenanzeige = ""
Sekundenanzeige = ""
Stunde = 0
Minute = 0
Sekunde = 0
I2C_LCD2004.lcd_init(39)
I2C_LCD2004.show_string("MicroBit-Daten", 3, 0)
I2C_LCD2004.show_string("Temperatur:", 0, 1)
I2C_LCD2004.show_string("Lichtstärke:", 0, 2)
I2C_LCD2004.show_string("Laufzeit:", 0, 3)
Zeit = 0

def on_forever():
    global Zeit, Sekunde, Minute, Stunde, Sekundenanzeige, Minutenanzeige, Stundenanzeige
    Zeit += 1
    Sekunde = int(Zeit % 60)
    Minute = int(Zeit / 60 % 60)
    Stunde = int(Zeit / 3600)
    if Sekunde < 10:
        Sekundenanzeige = "0" + convert_to_text(Sekunde)
    else:
        Sekundenanzeige = convert_to_text(Sekunde)
    if Minute < 10:
        Minutenanzeige = "0" + convert_to_text(Minute)
    else:
        Minutenanzeige = convert_to_text(Minute)
    if Stunde < 10:
        Stundenanzeige = "0" + convert_to_text(Stunde)
    else:
        Stundenanzeige = convert_to_text(Stunde)
    I2C_LCD2004.show_string("" + Stundenanzeige + ":" + Minutenanzeige + ":" + Sekundenanzeige,
        12,
        3)
    I2C_LCD2004.show_string("" + str(input.temperature()) + "°C", 16, 1)
    I2C_LCD2004.show_string("" + str(int(input.light_level() / 255 * 100)) + "%", 16, 2)
    basic.pause(1000)
basic.forever(on_forever)
