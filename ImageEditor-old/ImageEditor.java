import java.util.*;
import java.io.*;
import java.awt.*;
import java.awt.image.*;
import javax.imageio.*;

public class ImageEditor
{

    /*
     ////////////////////////HOW TO USE//////////////////////
     switchColors
        Switches the rgb colors of whatever you want (i.e. replace green with blue)
        can entirely replace an rgb color as well with another one of my choosing
     fixTransparentEdges
        any transparent pixel in the image that is not completely transparent is made non-transparent
        can be used for any transparency level
        does not work when black is blended in with the pixel and not actually transparent
     transparentPattern
        makes image transparent completely and transitions to non-transparent
     */
    public static void switchColors(BufferedImage image)
    {
        int width = image.getWidth();
        int height = image.getHeight();

        for (int a = 0; a < height; a++)
        {
            for (int o = 0; o < width; o++)
            {
                int pixel = image.getRGB(o, a);
                int alpha = (pixel >> 24) & 0x000000FF;
                int red = (pixel >> 16) & 0x000000FF;
                int green = (pixel >> 8 ) & 0x000000FF;
                int blue = (pixel) & 0x000000FF;

                Color color = new Color(red, blue, green, alpha);
                image.setRGB(o, a, color.getRGB());
            }
        }
    }

    public static void fixTransparentEdges(BufferedImage image)
    {
        int width = image.getWidth();
        int height = image.getHeight();

        for (int a = 0; a < height; a++)
        {
            for (int o = 0; o < width; o++)
            {
                int pixel = image.getRGB(o, a);
                int alpha = (pixel >> 24) & 0x000000FF;
                int red = (pixel >> 16) & 0x000000FF;
                int green = (pixel >> 8 ) & 0x000000FF;
                int blue = (pixel) & 0x000000FF;

                if (alpha > 0) { alpha = 255; }
                red = 255;
                green = 255;
                blue = 255;
                Color color = new Color(red, green, blue, alpha);
                image.setRGB(o, a, color.getRGB());
            }
        }
    }

    public static void makeImageTransparent(BufferedImage image)
    {
        int width = image.getWidth();
        int height = image.getHeight();

        for (int a = 0; a < height; a++)
        {
            for (int o = 0; o < width; o++)
            {
                int pixel = image.getRGB(o, a);
                int alpha = (pixel >> 24) & 0x000000FF;
                int red = (pixel >> 16) & 0x000000FF;
                int green = (pixel >> 8 ) & 0x000000FF;
                int blue = (pixel) & 0x000000FF;

                int newAlpha = 255 - (red + green + blue) / 3;
                Color color = new Color(red, green, blue, newAlpha);
                image.setRGB(o, a, color.getRGB());
            }
        }
    }

    public static void transparentPattern(BufferedImage image)
    {
        int width = image.getWidth();
        int height = image.getHeight();

        double heightNum = height / 255.0;
        for (int a = 0; a < height; a++)
        {
            int num = (int)(a / heightNum);
            for (int o = 0; o < width; o++)
            {
                int pixel = image.getRGB(o, a);
                int alpha = (pixel >> 24) & 0x000000FF;
                int red = (pixel >> 16) & 0x000000FF;
                int green = (pixel >> 8 ) & 0x000000FF;
                int blue = (pixel) & 0x000000FF;


                Color color = new Color(red, green, blue, num);
                image.setRGB(o, a, color.getRGB());
            }
        }
    }

    public static void verticalColorGradient(BufferedImage image, Color start, Color result)
    {
        int width = image.getWidth();
        int height = image.getHeight();

        double heightNum = height / 255.0;

        double rDif = (result.getRed() - start.getRed()) / (height * 1.0);
        double gDif = (result.getGreen() - start.getGreen()) / (height * 1.0);
        double bDif = (result.getBlue() - start.getBlue()) / (height * 1.0);

        int red = start.getRed();
        int green = start.getGreen();
        int blue = start.getBlue();

        for (int a = 0; a < height; a++)
        {
            int num = (int)(a / heightNum);
            for (int o = 0; o < width; o++)
            {
                Color color = new Color(red + (int)(rDif * a), green + (int)(gDif * a), blue + (int)(bDif * a), 255);
                image.setRGB(o, a, color.getRGB());
            }
        }
    }

    public static BufferedImage copyImage(BufferedImage source)
    {
        BufferedImage b = new BufferedImage(source.getWidth(), source.getHeight(), source.getType());
        Graphics g = b.getGraphics();
        g.drawImage(source, 0, 0, null);
        g.dispose();
        return b;
    }


    public static void main(String[] args)
    {
        String directoryString = "my_pathname";
        File directory = new File(directoryString);
        String[] fileTypes = {"jpg", "png"};

        FilenameFilter imageFilter = new FilenameFilter()
        {
            public boolean accept(File dir, String name)
            {
                for (int i = 0; i < fileTypes.length; i++)
                {
                    if (name.endsWith("." + fileTypes[i])) { return true; }
                }
                return false;
            }
        };


        try
        {
            File[] images = directory.listFiles(imageFilter);
            for (int i = 0; i < images.length; i++)
            {
                if (images[i].getName().indexOf("Copy") > 0) { continue; }
                if (images[i].getName().indexOf("ColorGradient") < 0) { continue; }
                BufferedImage image = ImageIO.read(images[i]);
                System.out.println(images[i].getName() + ": " + image.getWidth() + " x " + image.getHeight());


                BufferedImage imageCopy = copyImage(image);
                //switchColors(imageCopy);
                //fixTransparentEdges(imageCopy);
                //transparentPattern(imageCopy);
                //makeImageTransparent(imageCopy);

                Color startColor = new Color(255, 255, 255, 255);
                Color endColor = new Color(91, 91, 91, 255);
                verticalColorGradient(imageCopy, startColor, endColor);

                System.out.println("Done with " + images[i].getName());

                String fileName = images[i].getName().substring(0, images[i].getName().indexOf("."));
                File output = new File(directoryString + "\\" + fileName + "Copy.png");
                ImageIO.write(imageCopy, "png", output);

            }

        }
        catch (IOException e) { }
    }
}
