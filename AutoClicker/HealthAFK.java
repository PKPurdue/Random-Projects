import java.util.*;
import java.io.*;
import java.awt.event.*;
import java.awt.*;
import java.awt.PointerInfo;

public class HealthAFK extends Thread
{
    public static void wait(double timm)
    {
        int tim = (int)(timm * 1000);
        Thread t = currentThread();
        t.yield();
        try
        {
            Thread.sleep(tim);
            Thread.yield();
        }
        catch (InterruptedException e) { }
    }

    /*
      keep user in a certain spot until health falls too low, then move it back until health recovers
    */
    public static void pressKeys(Robot bot)
    {
        Random random = new Random();
        long lastPotion = System.currentTimeMillis() - 360000;
        for (int i = 0; i < 1000; i++)
        {
            if (System.currentTimeMillis() - lastPotion > 345000 + random.nextInt(10000))
            {
                lastPotion = System.currentTimeMillis();
                if (random.nextInt(2) == 1)
                {
                    bot.keyPress(KeyEvent.VK_MINUS);
                    wait((10 + random.nextInt(50)) / (250.0 + random.nextInt(100)));
                    bot.keyRelease(KeyEvent.VK_MINUS);
                    wait((10 + random.nextInt(500)) / (250.0 + random.nextInt(100)));
                    bot.keyPress(KeyEvent.VK_EQUALS);
                    wait((10 + random.nextInt(50)) / (250.0 + random.nextInt(100)));
                    bot.keyRelease(KeyEvent.VK_EQUALS);
                }
                else
                {
                    bot.keyPress(KeyEvent.VK_EQUALS);
                    wait((10 + random.nextInt(50)) / (250.0 + random.nextInt(100)));
                    bot.keyRelease(KeyEvent.VK_EQUALS);
                    wait((10 + random.nextInt(500)) / (250.0 + random.nextInt(100)));
                    bot.keyPress(KeyEvent.VK_MINUS);
                    wait((10 + random.nextInt(50)) / (250.0 + random.nextInt(100)));
                    bot.keyRelease(KeyEvent.VK_MINUS);
                }
            }
            wait(2.0 + (100 / (250.0 + random.nextInt(100))));
            Color color = bot.getPixelColor(803, 964);
            //Middle: (803, 964) RGB: (60, 74, 80)
            int red = color.getRed();
            int green = color.getGreen();
            int blue = color.getBlue();

            if (Math.abs(red - 60) > 20 || Math.abs(green - 74) > 20 || Math.abs(blue - 80) > 20)
            {
                System.out.println("Low on health!");
                //bot.keyPress(KeyEvent.VK_F);
                wait((20 + random.nextInt(50)) / (250.0 + random.nextInt(100)));
                //bot.keyRelease(KeyEvent.VK_F);
            }
        }
    }

    public static void main(String args[])
    {
        Robot bot = null;
        try {
            bot = new Robot();
            System.out.println("Bot created");
        }
        catch (Exception failed) {
            System.err.println("Failed instantiating Robot: " + failed);
        }
        wait(5.0);

        pressKeys(bot);
    }
}
