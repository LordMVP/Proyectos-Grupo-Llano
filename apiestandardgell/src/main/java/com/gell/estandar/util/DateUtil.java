package com.gell.estandar.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.sql.Time;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author hrey
 */
public class DateUtil
{

  public static java.sql.Date parseDate(java.util.Date fecha)
  {
    if (fecha == null) {
      return null;
    }
    return new java.sql.Date(fecha.getTime());
  }

  public static java.sql.Timestamp parseTimestamp(java.util.Date fecha)
  {
    if (fecha == null) {
      return null;
    }
    return new java.sql.Timestamp(fecha.getTime());
  }

  public static int parseToStringAnio(java.util.Date fecha)
  {
    Calendar calendario = Calendar.getInstance();
    calendario.setTime(fecha);
    return calendario.get(Calendar.YEAR);
  }

  /**
   * Transforma una fecha clasica a una fecha del paquete
   * <code>java.time.Localdate</code> para facilitar el tema de comparaciones
   *
   * @param fecha fecha como instancia de <code>java.util.Date</code>
   * @return fecha com instancia de <code>java.time.LocalDate</code>
   */
  public static LocalDate obtenerFechaLocal(java.util.Date fecha)
  {
    return fecha.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
  }

  /**
   * Transforma una fecha clasica a una fecha del paquete
   * <code>java.time.LocalDateTime</code> para facilitar el tema de
   * comparaciones
   *
   * @param fecha fecha como instancia de <code>java.time.LocalDateTime</code>
   * @return fecha com instancia de <code>java.time.LocalDateTime</code>
   */
  public static LocalDateTime obtenerFecha(java.util.Date fecha)
  {
    return fecha.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
  }

  /**
   * Transforma una fecha del paquete <code>java.time.Localdate</code> a una
   * fecha clasica por temas te compatibilidad en el guardado de bases de datos
   * posterior a las comparaciones entre instancias de
   * <code>java.time.LocalDate</code> para facilitar el tema de comparaciones
   *
   * @param fecha fecha como instancia de <code>java.time.LocalDate</code>
   * @return fecha com instancia de <code>java.util.Date</code>
   */
  public static Date obtenerFechaClasica(LocalDate fecha)
  {
    return Date.from(fecha.atStartOfDay(ZoneId.systemDefault()).toInstant());
  }

  /**
   * Transforma una fecha del paquete <code>java.time.LocalDateTime</code> a una
   * fecha clasica por temas te compatibilidad en el guardado de bases de datos
   * posterior a las comparaciones entre instancias de
   * <code>java.time.LocalDateTime</code> para facilitar el tema de
   * comparaciones
   *
   * @param fecha fecha como instancia de <code>java.time.LocalDate</code>
   * @return fecha com instancia de <code>java.util.Date</code>
   */
  public static Date obtenerFechaClasica(LocalDateTime fecha)
  {
    return Date.from(fecha.atZone(ZoneId.systemDefault()).toInstant());
  }

  /**
   * Convierte la fecha de un String a un Date
   *
   * @param fecha Indicador que contiene la fecha a convertir
   * @return la fecha clasica
   */
  public static Date convertir(String fecha)
  {
    LocalDate fechaDate = LocalDate.parse(fecha);

    return obtenerFechaClasica(fechaDate);

  }

  /**
   * Obtiene el numero de horas que existen entre un intervalo de tiempo
   *
   * @param horaInicial inicio del intervalo
   * @param horaFinal fin del intervalo
   * @return numero de horas dentro del intervalo
   */
  public static long obtenerHoras(Time horaInicial, Time horaFinal)
  {
    return ChronoUnit.HOURS.between(horaInicial.toLocalTime(), horaFinal.toLocalTime());
  }

  /**
   * Método encargado de validar que la fecha que se pase por parámetro esté
   * antes p después de la del sistema
   *
   * @param fechaComparar fecha a verificar
   * @param antes TRUE indica que la fecha tiene que estar antes de la del
   * sistema, FALSE la fecha que se para como parámetro tiene que estar después
   * a la del sistema sistema
   * @throws AplicacionExcepcion
   */
  private static void validarFechaSistema(Date fechaComparar, boolean antes)
          throws AplicacionExcepcion
  {
    if (fechaComparar == null) {
      throw new AplicacionExcepcion(
              EMensajeEstandar.ERROR_VALIDACION_MENSAJE,
              "La fecha a validar no puede estar vacía "
      );
    }
    Date fechaSistema = new Date();
    if (fechaComparar.after(fechaSistema) && antes) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, "La fecha enviada esta antes de la del sistema");
    }
    if (fechaSistema.before(fechaComparar) && !antes) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_VALIDACION_MENSAJE, "La fecha enviada esta después de la del sistema");
    }
  }

  /**
   * Valida que la fecha que se envía debe estar antes de la del sistema,se
   * valida con horas, minutos y segundos
   *
   * @param fecha Fecha a validar
   * @throws AplicacionExcepcion Si la fecha está después se lanza un error
   */
  public static void validarFechaSistemaAntes(Date fecha)
          throws AplicacionExcepcion
  {
    validarFechaSistema(fecha, true);
  }

  /**
   * Valida que la fecha que se envía debe estar después de la del sistema se
   * valida con horas, minutos y segundos
   *
   * @param fecha Fecha a validar
   * @throws AplicacionExcepcion Si la fecha está antes se lanza un error
   */
  public static void validarFechaSistemaDespues(Date fecha)
          throws AplicacionExcepcion
  {
    validarFechaSistema(fecha, false);
  }

  public static String formatoFecha(Date fecha, String formato)
  {
    if (fecha == null) {
      return "";
    }
    SimpleDateFormat format = new SimpleDateFormat(formato);
    return format.format(fecha);
  }

  @SuppressWarnings("UseSpecificCatch")
  public static Date convertirFecha(String formato, String fecha)
          throws AplicacionExcepcion
  {
    try {
      SimpleDateFormat format = new SimpleDateFormat(formato);
      return format.parse(fecha);
    } catch (Exception e) {
      LogUtil.info(e.getMessage());
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_FECHA);
    }
  }

  /**
   * Calcula el último día de un mes (yyyy-MM)
   *
   * @param mes
   * @return fecha del último día
   * @throws AplicacionExcepcion Error al convertir la fecha
   */
  public static LocalDate ultimoDiaMes(String mes)
          throws AplicacionExcepcion
  {
    try {
      mes += "-01";
      LocalDate fecha = LocalDate.parse(mes, DateTimeFormatter.ISO_DATE);
      return fecha.plusMonths(1).minusDays(1);
    } catch (Exception e) {
      LogUtil.error(e);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_FECHA);
    }
  }

  public static LocalDate primerDiaMes(String mes)
          throws AplicacionExcepcion
  {
    try {
      mes += "-01";
      return LocalDate.parse(mes, DateTimeFormatter.ISO_DATE);
    } catch (Exception e) {
      LogUtil.error(e);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_FECHA);
    }
  }

  public static boolean entre(LocalDateTime fecha, LocalDateTime fechaInicio, LocalDateTime fechaFin)
  {
    return (fecha.isEqual(fechaInicio) || fecha.isAfter(fechaInicio)) && (fecha.isEqual(fechaFin) || fecha.isBefore(fechaFin));
  }

  public static boolean entre(LocalDate fecha, LocalDate fechaInicio, LocalDate fechaFin)
  {
    return (fecha.isEqual(fechaInicio) || fecha.isAfter(fechaInicio)) && (fecha.isEqual(fechaFin) || fecha.isBefore(fechaFin));
  }

  public static boolean menorIgual(LocalDate fecha, LocalDate fechaFin)
  {
    return fecha.isBefore(fechaFin) || fecha.isEqual(fechaFin);
  }

  public static int diasPeriodo(String periodo)
          throws AplicacionExcepcion
  {
    LocalDate fechaInicio = ultimoDiaMes(periodo);
    LocalDate fechaFin = primerDiaMes(periodo);
    return (int) (ChronoUnit.DAYS.between(fechaFin, fechaInicio) + 1);
  }

}
