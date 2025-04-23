import {
  FilterQuery,
  Model,
  PopulateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

interface FindOptions<TDocument> {
  filter?: FilterQuery<TDocument>;
  populate?: PopulateOptions[];
  select?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export abstract class DatabaseRepo<TDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return this.model.create(data);
  }

  async find({
    filter = {},
    populate = [],
    select = '',
    sort = '',
    page = 1,
    limit = 5,
  }: FindOptions<TDocument>): Promise<TDocument[] | null> {
    const data = this.model.find(filter);

    if (select) data.select(select.replaceAll(',', ' '));
    if (populate) data.populate(populate);
    if (sort) data.sort(sort.replaceAll(',', ' '));
    if (limit) data.limit(limit);

    if (page) {
      const skip = (page - 1) * limit;
      data.skip(skip);
    }

    return await data.exec();
  }

  async findOne(
    query: FilterQuery<TDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<TDocument | null> {
    let data = this.model.findOne(query);

    if (populate) data = data.populate(populate);

    return data;
  }

  async findById(id: Types.ObjectId): Promise<TDocument | null> {
    return this.model.findById(id);
  }

  async findOneAndUpdate(
    query: FilterQuery<TDocument>,
    filter: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOneAndUpdate(query, filter, { new: true });
  }

  async findOneAndDelete(
    query: FilterQuery<TDocument>,
    populate?: PopulateOptions | PopulateOptions[],
  ): Promise<TDocument | null> {
    let data = this.model.findOneAndDelete(query);

    if (populate) data = data.populate(populate);

    return data;
  }
}
