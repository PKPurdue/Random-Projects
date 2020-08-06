import java.util.*;
import java.io.*;
import java.awt.event.*;
import java.awt.*;
import java.lang.*;

public class AutoClicker extends Thread
{
    static long keys[] = {0, 0, 0, 0};
    static int keysTime[] = {7000, 9000, 12000, 8000};
    static int actualKeys[] = {KeyEvent.VK_1, KeyEvent.VK_2, KeyEvent.VK_3, KeyEvent.VK_4};
    public static void wait(int timm)
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

    public static void wait(double tim)
    {
        int timm = (int)(tim);
        Thread t = currentThread();
        t.yield();
        try
        {
            Thread.sleep(timm);
            Thread.yield();
        }
        catch (InterruptedException e) { }
    }

    public static void pressKeys(Robot bot) //Press a sequence of keys and wait for the powerups to stop
    {
        Random random = new Random();
        while (true)
        {
            /*for (int i = 0; i < keys.length; i++)
            {
                if (System.currentTimeMillis() - keys[i] > keysTime[i])
                {
                    keys[i] = System.currentTimeMillis();
                    wait(10.0 + random.nextInt(50) / (250 + random.nextInt(100)));
                    bot.keyPress(actualKeys[i]);
                    wait(100.0 + random.nextInt(100) / (100 + random.nextInt(100)));
                    bot.keyRelease(actualKeys[i]);
                    wait(250.0 + random.nextInt(100) / (100 + random.nextInt(100)));
                    bot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
                    wait(10.0 + random.nextInt(50) / (250 + random.nextInt(100)));
                    bot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
                    break;
                }
            }*/
            wait(100 + random.nextInt(100));
            bot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
            wait(10.0 + random.nextInt(50) / (250 + random.nextInt(100)));
            bot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);

            if (random.nextInt(100) > 25)
            {
                bot.keyPress(KeyEvent.VK_SPACE);
                wait(10.0 + random.nextInt(50) / (250 + random.nextInt(100)));
                bot.keyRelease(KeyEvent.VK_SPACE);
            }
        }
    }

    public static void pressKeysAFK(Robot bot) //presses keys to keep movement in-game
    {
        Random random = new Random();
        for (int i = 0; i < 1000; i++)
        {
            bot.keyPress(KeyEvent.VK_D);
            wait(1.0 + (100 / (250.0 + random.nextInt(100))));
            if (random.nextInt(100) > 92.0)
            {
                moveMouseToPos(bot, 150 + random.nextInt(1200), 100 + random.nextInt(400));
            }
            bot.keyRelease(KeyEvent.VK_D);
            wait((31.0 + random.nextInt(80) / 100));
            bot.keyPress(KeyEvent.VK_A);
            wait(1.0 + (100 / (250.0 + random.nextInt(100))));
            bot.keyRelease(KeyEvent.VK_A);
            wait(96.0 + random.nextInt(500) / 200);
        }
    }

    public static void moveMouseToPos(Robot bot, int newX, int newY) //move mouse to new position
    {
        int oldX = (int)MouseInfo.getPointerInfo().getLocation().getX();
        int oldY = (int)MouseInfo.getPointerInfo().getLocation().getY();
        int xDif = (newX - oldX);
        int yDif = (newY - oldY);
        int interval = (int)Math.floor(yDif / 5);
        if (Math.floor(xDif / 10) > interval) { interval = (int)Math.floor(xDif / 10); }
        double xAmount = xDif / (interval + 0.0);
        double yAmount = yDif / (interval + 0.0);
        for (int i = 0; i < interval; i++)
        {
            bot.mouseMove((int)(oldX + xAmount * (i + 1)), (int)(oldY + yAmount * (i + 1)));
            wait(.01);
        }
    }

    public static void clickRepeat(Robot bot, double clickInterval) //spam click with no mouse movement, at random intervals
    {
        Random random = new Random();
        while (true)
        {

            wait(clickInterval + random.nextInt((int)Math.floor(clickInterval * .2)));
            bot.mousePress(InputEvent.BUTTON1_DOWN_MASK);
            wait(10.0 + random.nextInt(50) / (250 + random.nextInt(100)));
            bot.mouseRelease(InputEvent.BUTTON1_DOWN_MASK);
        }
    }

    public static void clickRandomly(Robot bot) //move mouse around and click
    {
        Random random = new Random();
        int mask = InputEvent.BUTTON1_DOWN_MASK;
        wait(5.0);
        for (int i = 0; i < 1000; i++)
        {
            System.out.println("Iteration: " + i);
            moveMouseToPos(bot, 250 + random.nextInt(1000), 100 + random.nextInt(750));
            wait(random.nextInt(100) / 50.0);
            bot.mousePress(mask);
            bot.mouseRelease(mask);
            wait(random.nextInt(100) / (1.0 + random.nextInt(20)));
        }
    }

    public static void clickOnInterval(Robot bot, double tim) //spam mouse click on a fixed interval
    {
        int mask = InputEvent.BUTTON1_DOWN_MASK;
        wait(5.0);
        for (int i = 0; i < 1000; i++)
        {
            wait(tim);
            bot.mousePress(mask);
            wait(.02);
            bot.mouseRelease(mask);
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
        //clickRepeat(bot, 1100);
    }
}
