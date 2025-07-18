export const evaluateFormula = (formula: string, row: Record<string, any>): any => {
  const replaced = formula.replace(/\{(.*?)\}/g, (_, key) => {
    const value = row[key];
    return (typeof value === "number" ? value : parseFloat(value) || 0).toString();
  });

  try {
    return eval(replaced);
  } catch (err) {
    console.error("Formula error:", err);
    return "";
  }
};
