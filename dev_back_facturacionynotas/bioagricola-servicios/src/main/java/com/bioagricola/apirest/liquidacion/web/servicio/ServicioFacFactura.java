package com.bioagricola.apirest.liquidacion.web.servicio;

import com.bioagricola.apirest.liquidacion.negocio.NegocioFacFactura;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IFacFactura;
import com.bioagricola.apirest.modelo.dtos.*;
import com.bioagricola.apirest.modelo.dtos.payload.FacFacturaPayload;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.bioagricola.apirest.modelo.utils.GeneralBodyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad FacFactura
 *
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/facfactura")
public class ServicioFacFactura implements IFacFactura {

    @Autowired
    private NegocioFacFactura negocioFacFactura;

    @GetMapping
    public List<FacFacturaDTO> consultar(@RequestParam(value = "filterBy") String filterBy,
                                         @RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "from") Integer from,
                                         @RequestParam(value = "to") Integer to)
            throws InvalidParameterException {

        return negocioFacFactura.consultar(filterBy, orderBy, from, to);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public FacFacturaDTO insertarFactura(@RequestBody FacFacturaDTO facFacturaDTO) {

        return negocioFacFactura.crear(facFacturaDTO);

    }

    @PutMapping(consumes = "application/json", produces = "application/json")
    public FacFacturaDTO actualizar(@RequestBody FacFacturaDTO facFacturaDTO) {

        return negocioFacFactura.actualizar(facFacturaDTO);
    }

    @DeleteMapping
    public String eliminar(@RequestParam("facIderegistro") Long facIderegistro) {

        return negocioFacFactura.eliminar(facIderegistro);
    }


    @GetMapping("/contar")
    public String contar(@RequestParam(value = "filterBy") String filterBy,
                         @RequestParam(value = "from") Integer from,
                         @RequestParam(value = "to") Integer to) throws InvalidParameterException {

        return negocioFacFactura.contar(filterBy, from, to);
    }

    @GetMapping("/lista")
    public List<String> consultarLista(@RequestParam(value = "filterBy") String filterBy,
                                       @RequestParam(value = "orderBy") String orderBy, @RequestParam(value = "atributo") String atributo) throws InvalidParameterException {

        return negocioFacFactura.consultarLista(filterBy, orderBy, atributo);
    }

    @PostMapping(value = "/FacturaCicloPeriodoActual", consumes = "application/json")
    public Long getFacturaCicloPeriodoActual(@RequestBody RequestIdFacFacturaDTO requestId) {
        return negocioFacFactura.getFacturaCicloPeriodoActual(
                requestId.getDsusIderegistr(),
                requestId.getUniDocumento(),
                requestId.getUniTipdocument(),
                requestId.getCicIderegistro(),
                requestId.getPerIderegistro(),
                requestId.getCicAno());
    }

    @Override
    @PostMapping(value = "/ConsultarFacturasGeneradas", consumes = "application/json")
    public Object[] getConsultarFacturasGeneradas(@RequestBody RequestConsultarFacturasGeneradas requestId) {
        return negocioFacFactura.getConsultarFacturasGeneradas(
                requestId.getEmpIderegistro(),
                requestId.getCicIderegistro());
    }

    /**
     * @param facFacturaPayload
     * @return
     */
    @Override
    @PostMapping(value = "/FiltroFactura", produces = "application/json")
    public ResponseEntity<GeneralBodyResponse<Page<FacFacturaDTOResponse>>> filterInvoice(@RequestBody FacFacturaPayload facFacturaPayload, Pageable pageable) {
        try {
            if (facFacturaPayload.getDateInit() == null || facFacturaPayload.getDateEnd() == null || (facFacturaPayload.getDsusId() == null && facFacturaPayload.getCodBefore()==null) )
                return new ResponseEntity<>(
                        new GeneralBodyResponse<>(null, "los campos Id Suscripción o Codigo Anterior , Fecha Desde y Fecha Hasta SON obligatorios", null),
                        HttpStatus.BAD_REQUEST);

            if (facFacturaPayload.getDateEnd().getTime() < facFacturaPayload.getDateInit().getTime())
                return new ResponseEntity<>(
                        new GeneralBodyResponse<>(null, "la fecha Hasta NO DEBE ser menor que la fecha Desde", null),
                        HttpStatus.BAD_REQUEST);

            Page<FacFacturaDTOResponse> listFacFactura = negocioFacFactura.filterInvoice(facFacturaPayload.getDateInit(),
                    facFacturaPayload.getDateEnd(), facFacturaPayload.getDsusId(), facFacturaPayload.getCodBefore(), facFacturaPayload.getNumInvoice(), pageable);

            return new ResponseEntity<>(
                    new GeneralBodyResponse<>(listFacFactura, !listFacFactura.getContent().isEmpty() ? "existen facturas" : "no existen facturas", null),
                    HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity<>(new GeneralBodyResponse<>(null, ex.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @GetMapping(value = "/DocumentoAsociado/{idInvoice}/suscripcion/{dsusId}", produces = "application/json")
    public ResponseEntity<GeneralBodyResponse<Page<DocDocumentoFacturaDTOResponse>>> associatedDocumentInvoice(@PathVariable Long idInvoice, @PathVariable Long dsusId, Pageable pageable) {
        try {
            Page<DocDocumentoFacturaDTOResponse> docDocumentoFacturaList = negocioFacFactura.associatedDocument(idInvoice, dsusId, pageable);

            return new ResponseEntity<>(
                    new GeneralBodyResponse<>(docDocumentoFacturaList, !docDocumentoFacturaList.getContent().isEmpty() ? "existen documentos asociados a la factura" : "no existen documentos asociados a la factura", null),
                    HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(new GeneralBodyResponse<>(null, ex.getMessage(), null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}