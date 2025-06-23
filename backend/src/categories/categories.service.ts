import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(filterDto: CategoryFilterDto, userId: number) {
    const { search, isActive, page = 1, limit = 10 } = filterDto;

    // Build query with cronJobs count
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.cronJobs', 'cronJob')
      .addSelect('COUNT(cronJob.id)', 'cronJobsCount')
      .where('category.userId = :userId', { userId })
      .groupBy('category.id')
      .orderBy('category.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      queryBuilder.andWhere('category.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    const categoriesWithCount = await queryBuilder.getRawAndEntities();

    // Get total count for pagination
    const totalQuery = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.user.id = :userId', { userId });

    if (search) {
      totalQuery.andWhere('category.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (isActive !== undefined) {
      totalQuery.andWhere('category.isActive = :isActive', { isActive });
    }

    const total = await totalQuery.getCount();

    // Map results to include cronJobsCount
    const categories = categoriesWithCount.entities.map((category, index) => ({
      ...category,
      cronJobsCount:
        parseInt(categoriesWithCount.raw[index].cronJobsCount) || 0,
    }));

    return {
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
      relations: ['cronJobs'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.findOne(id, userId); // Ensure exists and belongs to user
    await this.categoryRepository.update(
      { id, userId },
      updateCategoryDto,
    );
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.categoryRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }

  async getAnalytics(userId: number) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select([
        'COUNT(*) as totalCategories',
        'COUNT(CASE WHEN category.isActive = true THEN 1 END) as activeCategories',
      ])
      .where('category.user.id = :userId', { userId })
      .getRawOne();
  }
}
