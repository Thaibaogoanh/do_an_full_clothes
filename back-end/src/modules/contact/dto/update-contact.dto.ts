import { OmitType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends OmitType(CreateContactDto, ['userId']) {}
