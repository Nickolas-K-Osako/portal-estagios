package gui;

import javax.swing.*;
import java.awt.*;
import java.util.List;

public class TelaEmpresa extends TelaBase {

    private final EmpresaService service = new EmpresaService();
    private List<Empresa> empresas;

    public TelaEmpresa() {
        super("Gestão de Empresas - UniALFA", 850, 500);
    }

    @Override
    protected String labelBusca() {
        return "Buscar por nome:";
    }

    @Override
    protected String[] colunas() {
        return new String[]{"ID", "Nome", "CNPJ", "Email", "Telefone", "Área", "Status"};
    }

    @Override
    protected void configurarColunas() {
        tabela.getColumnModel().getColumn(0).setPreferredWidth(40);
        tabela.getColumnModel().getColumn(2).setPreferredWidth(120);
        tabela.getColumnModel().getColumn(6).setPreferredWidth(80);
    }

    @Override
    protected void carregarDados() {
        empresas = service.listar();
        preencherTabela(empresas);
    }

    @Override
    protected void buscar(String termo) {
        if (termo.isBlank()) {
            carregarDados();
            return;
        }
        List<Empresa> filtradas = empresas.stream()
                .filter(e -> e.getNome().toLowerCase().contains(termo))
                .toList();
        preencherTabela(filtradas);
    }

    @Override
    protected JPanel montarRodape() {
        JButton btnNova = new JButton("Nova Empresa");
        JButton btnEditar = new JButton("Editar");
        JButton btnExcluir = new JButton("Excluir");
        JButton btnStatus = new JButton("Alternar Status");

        btnNova.addActionListener(e -> abrirFormulario(null));
        btnEditar.addActionListener(e -> {
            Empresa selecionada = getEmpresa();
            if (selecionada != null) abrirFormulario(selecionada);
        });
        btnExcluir.addActionListener(e -> excluir());
        btnStatus.addActionListener(e -> alternarStatus());

        JPanel rodape = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 8));
        rodape.add(btnNova);
        rodape.add(btnEditar);
        rodape.add(btnExcluir);
        rodape.add(btnStatus);
        return rodape;
    }

    private void preencherTabela(List<Empresa> lista) {
        modelo.setRowCount(0);
        for (Empresa e : lista) {
            modelo.addRow(new Object[]{
                    e.getId(), e.getNome(), e.getCnpj(),
                    e.getEmail(), e.getTelefone(),
                    e.getAreaAtuacao(), e.getStatus()
            });
        }
    }

    private Empresa getEmpresa() {
        int id = getIdSelecionado("uma empresa");
        if (id == -1) return null;
        return empresas.stream().filter(e -> e.getId() == id).findFirst().orElse(null);
    }

    private void abrirFormulario(Empresa empresa) {
        boolean editando = empresa != null;

        JTextField txtNome = new JTextField(editando ? empresa.getNome() : "", 20);
        JTextField txtCnpj = new JTextField(editando ? empresa.getCnpj() : "", 20);
        JTextField txtEmail = new JTextField(editando ? empresa.getEmail() : "", 20);
        JTextField txtTelefone = new JTextField(editando ? empresa.getTelefone() : "", 20);
        JTextField txtArea = new JTextField(editando ? empresa.getAreaAtuacao() : "", 20);

        JPanel form = new JPanel(new GridLayout(5, 2, 6, 6));
        form.add(new JLabel("Nome *:"));
        form.add(txtNome);
        form.add(new JLabel("CNPJ *:"));
        form.add(txtCnpj);
        form.add(new JLabel("Email:"));
        form.add(txtEmail);
        form.add(new JLabel("Telefone:"));
        form.add(txtTelefone);
        form.add(new JLabel("Área *:"));
        form.add(txtArea);

        int res = JOptionPane.showConfirmDialog(this, form,
                editando ? "Editar Empresa" : "Nova Empresa",
                JOptionPane.OK_CANCEL_OPTION);

        if (res == JOptionPane.OK_OPTION) {
            try {
                Empresa e = editando ? empresa : new Empresa();
                e.setNome(txtNome.getText().trim());
                e.setCnpj(txtCnpj.getText().trim());
                e.setEmail(txtEmail.getText().trim());
                e.setTelefone(txtTelefone.getText().trim());
                e.setAreaAtuacao(txtArea.getText().trim());
                if (!editando) e.setStatus("Ativo");

                if (editando) service.editar(e);
                else service.cadastrar(e);

                carregarDados();
                JOptionPane.showMessageDialog(this, editando ? "Empresa atualizada!" : "Empresa cadastrada!");
            } catch (IllegalArgumentException ex) {
                JOptionPane.showMessageDialog(this, ex.getMessage(), "Dados inválidos", JOptionPane.WARNING_MESSAGE);
            }
        }
    }

    private void excluir() {
        Empresa e = getEmpresa();
        if (e == null) return;
        int confirm = JOptionPane.showConfirmDialog(this,
                "Excluir a empresa \"" + e.getNome() + "\"?",
                "Confirmar", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            service.excluir(e.getId());
            carregarDados();
        }
    }

    private void alternarStatus() {
        Empresa e = getEmpresa();
        if (e == null) return;
        String novoStatus = e.getStatus().equals("Ativo") ? "Inativo" : "Ativo";
        e.setStatus(novoStatus);
        service.editar(e);
        carregarDados();
        JOptionPane.showMessageDialog(this, "Empresa marcada como " + novoStatus + ".");
    }
}