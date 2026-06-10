package backOffice.src.main.java.gui;

import javax.swing.*;
import java.awt.*;

public interface PainelDefault {
    default void painelAdd(JPanel painel, Component component, int coluna, int linha) {
        var c = new GridBagConstraints();
        c.gridx   = coluna;
        c.gridy   = linha;
        c.anchor  = GridBagConstraints.WEST;
        c.fill    = GridBagConstraints.HORIZONTAL;
        c.insets  = new Insets(6, 8, 6, 8);
        painel.add(component, c);
    }
}
