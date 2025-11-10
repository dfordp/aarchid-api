import mongoose from "mongoose";

interface PlantInput {
  user_id: mongoose.Schema.Types.ObjectId;
  name: string;
  species: string;
  dateOfPlanting: Date;
  comment?: string;
  image: string;
}
interface GetPlantsOptions {
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  lean?: boolean;
}

const plantSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name : { type: String, required: true },
    species : { type: String, required: true },
    dateOfPlanting : { type: Date, required: true },
    comment : { type: String, required: false },
    image : { type: String, required: true },
}, { timestamps: true });

const Plant = mongoose.model("Plant", plantSchema);

export default Plant;

// Plant Actions
export const getPlants = async (options: GetPlantsOptions = {}) => {
  const {
    filter = {},
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "desc",
    lean = true,
  } = options;

  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    Plant.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(lean),
    Plant.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const getPlantById = (id: string) => Plant.findById(id);
export const countPlantsByUserId = async (userId: string) => {
  return Plant.countDocuments({ user_id: userId });
};
export const createPlant = (values: PlantInput) => {
  console.log('Creating plant with values:', values);
  return new Plant(values).save()
    .then((plant) => plant.toObject())
    .catch((error) => {
      console.error('Error creating plant:', error);
      throw error;
    });
};
export const deletePlantById = (id: string) => Plant.findOneAndDelete({ _id: id });
export const updatePlantById = (id: string, values: Partial<PlantInput>) => Plant.findByIdAndUpdate(id, values, { new: true });