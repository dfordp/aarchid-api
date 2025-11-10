import mongoose from "mongoose";

interface HealthLogInput {
  user_id: mongoose.Schema.Types.ObjectId;
  plant_id: mongoose.Schema.Types.ObjectId;
  attachment?: string;
  name?: string;
  comment?: string;
  dateOfDiagnosis: Date;
  diagnosisByModel?: string;
}

interface GetHealthLogsOptions {
  filter?: Record<string, any>;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}


const healthLogSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plant_id : { type: mongoose.Schema.Types.ObjectId, ref: 'Plant' },
    attachment : { type: String, required: false },
    name : { type: String, required: false },
    comment : { type: String, required: false },
    dateOfDiagnosis : { type: Date, required: true },
    diagnosisByModel : { type: String, required: false },
});

const HealthLog = mongoose.model("HealthLog", healthLogSchema);

export default HealthLog;

// HealthLog Actions
export const getHealthLogs = async (options: GetHealthLogsOptions = {}) => {
  const {
    filter = {},
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    HealthLog.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit),
    HealthLog.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
export const getHealthLogById = (id: string) => HealthLog.findById(id);
export const createHealthLog = (values: HealthLogInput) => {
  console.log('Creating health log with values:', values);
  return new HealthLog(values).save()
    .then((healthLog) => healthLog.toObject())
    .catch((error) => {
      console.error('Error creating health log:', error);
      throw error;
    });
};
export const deleteHealthLogById = (id: string) => HealthLog.findOneAndDelete({ _id: id });
export const updateHealthLogById = (id: string, values: Partial<HealthLogInput>) => HealthLog.findByIdAndUpdate(id, values, { new: true });