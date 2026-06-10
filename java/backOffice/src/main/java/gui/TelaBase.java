package backOffice.src.main.java.gui;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
public abstract class TelaBase extends JFrame implements PainelDefault {

    protected JTable tabela;
    protected DefaultTableModel modelo;
    protected JTextField txtBusca;

    public TelaBase(String titulo, int largura, int altura) {
        setTitle(titulo);
        setSize(largura, altura);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        add(montarTopo(),   BorderLayout.NORTH);
        add(montarTabela(), BorderLayout.CENTER);
        add(montarRodape(), BorderLayout.SOUTH);

        carregarDados();
    }

    protected abstract String labelBusca();

    protected abstract String[] colunas();

    protected void configurarColunas() {}

    protected abstract JPanel montarRodape();

    protected abstract void carregarDados();

    protected abstract void buscar(String termo);

    private JPanel montarTopo() {
        JPanel topo = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 8));
        topo.add(new JLabel(labelBusca()));
        txtBusca = new JTextField(20);
        JButton btnBuscar = new JButton("Buscar");
        JButton btnLimpar = new JButton("Limpar");
        topo.add(txtBusca);
        topo.add(btnBuscar);
        topo.add(btnLimpar);

        btnBuscar.addActionListener(e -> buscar(txtBusca.getText().trim().toLowerCase()));
        txtBusca.addActionListener(e -> buscar(txtBusca.getText().trim().toLowerCase()));
        btnLimpar.addActionListener(e -> { txtBusca.setText(""); carregarDados(); });

        return topo;
    }
    private JScrollPane montarTabela() {
        modelo = new DefaultTableModel(colunas(), 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };
        tabela = new JTable(modelo);
        tabela.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        configurarColunas();
        return new JScrollPane(tabela);
    }
    protected int getIdSelecionado(String entidade) {
        int linha = tabela.getSelectedRow();
        if (linha < 0) {
            JOptionPane.showMessageDialog(this, "Selecione " + entidade + " na tabela.");
            return -1;
        }
        return (int) modelo.getValueAt(linha, 0);
    }
}
