import {
  Controller, Post, UseInterceptors, UploadedFiles,
  UseGuards, BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../../infrastructure/auth/decorators/roles.decorator';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('vehicle-images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER')
  @ApiBearerAuth('JWT')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max par image
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
          return cb(new BadRequestException('Seuls les formats JPEG, PNG et WebP sont acceptés'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Uploader des photos du véhicule',
    description: 'Upload 1 à 5 photos du véhicule avant de créer un trajet. Retourne les URLs Cloudinary à passer dans vehicleImages lors de POST /trips. Formats acceptés: JPEG, PNG, WebP. Taille max: 5MB par image. Rôle DRIVER requis.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Photos du véhicule (1 à 5 fichiers)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'URLs des images uploadées. Passer ces URLs dans vehicleImages lors de POST /trips.',
    schema: {
      example: {
        urls: [
          'https://res.cloudinary.com/demo/image/upload/v1/covoiturage/vehicles/abc123.jpg',
          'https://res.cloudinary.com/demo/image/upload/v1/covoiturage/vehicles/def456.jpg',
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Format invalide ou fichier trop lourd' })
  @ApiResponse({ status: 401, description: 'Token manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Rôle DRIVER requis' })
  async uploadVehicleImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Au moins une image est requise');
    }

    const urls = await Promise.all(
      files.map(file => this.cloudinaryService.uploadImage(file)),
    );

    return { urls };
  }
}
