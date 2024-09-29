// src/controllers/recipeVersionController.js
import RecipeVersion from "../models/recipeVersionModel.js";
import Recipe from "../models/recipeModel.js";

// Obtener todas las versiones de una receta
/*export const getVersionsByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const versions = await RecipeVersion.findAll({
      where: { recipe_id: recipeId },
    });
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/
// Obtener todas las versiones de una receta
export const getVersionsByRecipeId = async (req, res) => {
  try {
    const { recipeId } = req.params;

    console.log("Obteniendo versiones para la receta con ID:", recipeId);

    const versions = await RecipeVersion.findAll({
      where: { recipe_id: recipeId },
    });
    console.log("Versión obtenida desde la base de datos:", versions);

    // Asegurarnos de que steps está correctamente formateado
    const parsedVersions = versions.map((version) => {
      let steps;
      try {
        steps =
          typeof version.steps === "string"
            ? JSON.parse(version.steps)
            : version.steps;
            console.log("Steps después de la conversión:", steps);
      } catch (jsonError) {
        console.error("Error al convertir steps a JSON en getVersionsByRecipeId:", jsonError);
        steps = []; // Si hay un error en la conversión, devolvemos un array vacío para evitar problemas en el frontend
      }

      return {
        ...version.toJSON(),
        steps: steps || [], // Asegurarnos de que siempre se devuelve un array
      };
    });


    console.log("Versión final enviada al frontend:", parsedVersions);

    res.json(parsedVersions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva versión de receta
export const createVersion = async (req, res) => {
  try {
    const { recipeId } = req.params;
    let { version_name, steps } = req.body;
    console.log("Datos recibidos en createVersion:", { recipeId, version_name, steps });


    // Validar y convertir steps a JSON si es necesario
    try {
      if (typeof steps === "string") {
        steps = JSON.parse(steps); // Intentar convertir a JSON
        console.log("Steps después de JSON.parse:", steps);
      }
    } catch (jsonError) {
      console.error("Error al convertir steps a JSON:", jsonError);
      return res.status(400).json({
        message:
          "Formato incorrecto para los steps. Debe ser un array de objetos JSON.",
      });
    }

    if (!Array.isArray(steps)) {
      console.error("Steps no es un array después de la validación:", steps);
      return res
        .status(400)
        .json({ message: "Steps debe ser un array de objetos." });
    }

    const newVersion = await RecipeVersion.create({
      recipe_id: recipeId,
      version_name,
      steps,
    });

    console.log("Versión creada con éxito:", newVersion);

    res.status(201).json(newVersion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una versión de receta
export const updateVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    let { version_name, steps } = req.body;

    console.log("Datos recibidos en updateVersion:", { versionId, version_name, steps });

    const version = await RecipeVersion.findByPk(versionId);

    if (!version) {
      console.error("Versión no encontrada:", versionId);
      return res.status(404).json({ message: "Versión no encontrada" });
    }

    // Validar y convertir steps a JSON si es necesario
    try {
      if (typeof steps === "string") {
        steps = JSON.parse(steps); // Intentar convertir a JSON
        console.log("Steps después de JSON.parse:", steps);
      }
    } catch (jsonError) {
      console.error("Error al convertir steps a JSON:", jsonError);
      return res.status(400).json({
        message:
          "Formato incorrecto para los steps. Debe ser un array de objetos JSON.",
      });
    }

    if (!Array.isArray(steps)) {
      console.error("Steps no es un array después de la validación:", steps);
      return res
        .status(400)
        .json({ message: "Steps debe ser un array de objetos." });
    }

    version.version_name = version_name;
    version.steps = steps;

    await version.save();

    console.log("Versión actualizada con éxito:", version);

    res.json(version);
  } catch (error) {
    console.error("Error en updateVersion:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una versión de receta
export const deleteVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const version = await RecipeVersion.findByPk(versionId);
    if (!version) {
      return res.status(404).json({ message: "Versión no encontrada" });
    }
    await version.destroy();
    res.json({ message: "Versión eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
